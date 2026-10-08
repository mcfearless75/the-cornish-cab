import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

type Hit = { lat: number; lon: number; label: string };

const geoCache = new Map<string, Hit | null>();
const routeHits = new Map<string, number[]>();
let lastGeo = 0;

function allow(key: string): boolean {
  const now = Date.now();
  const fresh = (routeHits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (fresh.length >= 8) {
    routeHits.set(key, fresh);
    return false;
  }
  fresh.push(now);
  routeHits.set(key, fresh);
  return true;
}

async function waitTurn() {
  const wait = 1100 - (Date.now() - lastGeo);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastGeo = Date.now();
}

async function geocode(query: string): Promise<Hit | null> {
  const key = query.toLowerCase();
  if (geoCache.has(key)) return geoCache.get(key) ?? null;
  await waitTurn();
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "gb");
  url.searchParams.set("viewbox", "-5.8,51.6,-2.2,49.9");
  url.searchParams.set("bounded", "0");
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "TheCornishCab/1.0 (road-route guide for bookings)",
    },
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as { lat?: string; lon?: string; display_name?: string }[];
  const hit = rows[0];
  if (!hit?.lat || !hit.lon) {
    geoCache.set(key, null);
    return null;
  }
  const parsed: Hit = {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    label: (hit.display_name ?? query).split(",").slice(0, 3).join(", "),
  };
  if (!Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lon)) return null;
  geoCache.set(key, parsed);
  return parsed;
}

export const routeGuide = createServerFn({ method: "POST" })
  .validator((input: { from: string; to: string }) => {
    if (!input || typeof input !== "object") throw new Error("Add a pickup and a destination.");
    const from = (input as { from?: unknown }).from;
    const to = (input as { to?: unknown }).to;
    if (typeof from !== "string" || typeof to !== "string") {
      throw new Error("Add a pickup and a destination.");
    }
    const pickup = from.trim();
    const drop = to.trim();
    if (pickup.length < 3 || drop.length < 3 || pickup.length > 140 || drop.length > 140) {
      throw new Error("Use a place name for both ends, under 140 characters.");
    }
    return { from: pickup, to: drop };
  })
  .handler(async ({ data }) => {
    let key = "anon";
    try {
      key = getRequestIP({ xForwardedFor: true }) || "anon";
    } catch {
      key = "anon";
    }
    if (!allow(key)) {
      return { ok: false as const, error: "Too many route checks. Call 07708 067775 for the fare." };
    }

    const fromHit = await geocode(data.from);
    const toHit = await geocode(data.to);
    if (!fromHit || !toHit) {
      return {
        ok: false as const,
        error: "Those places could not be found on the map. Call 07708 067775 and read the addresses out.",
      };
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${fromHit.lon},${fromHit.lat};${toHit.lon},${toHit.lat}?overview=false`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      return { ok: false as const, error: "The road router is busy. Call 07708 067775 for the fare." };
    }
    const body = (await res.json()) as {
      code?: string;
      routes?: { distance?: number; duration?: number }[];
    };
    const route = body.routes?.[0];
    if (body.code !== "Ok" || !route?.distance || !route.duration) {
      return {
        ok: false as const,
        error: "No driving route came back. Call 07708 067775 and the driver will use the live road route.",
      };
    }

    const miles = Math.round((route.distance / 1609.344) * 10) / 10;
    const minutes = Math.max(1, Math.round(route.duration / 60));
    return {
      ok: true as const,
      miles,
      minutes,
      fromLabel: fromHit.label,
      toLabel: toHit.label,
    };
  });
