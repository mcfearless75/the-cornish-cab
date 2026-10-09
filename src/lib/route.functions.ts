import { createServerFn } from "@tanstack/react-start";
import { locatePlace, readOsrm } from "@/lib/road-route";
import { getRequestIP } from "@tanstack/react-start/server";

const routeHits = new Map<string, number[]>();

function allow(key: string): boolean {
  const now = Date.now();
  const fresh = (routeHits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (fresh.length >= 24) {
    routeHits.set(key, fresh);
    return false;
  }
  fresh.push(now);
  routeHits.set(key, fresh);
  return true;
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

    const [fromHit, toHit] = await Promise.all([locatePlace(data.from), locatePlace(data.to)]);
    if (!fromHit || !toHit) {
      return {
        ok: false as const,
        error: "The map did not recognise one of those addresses. Pick a suggestion, or try the street and the town, then press Get fare again.",
      };
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${fromHit.lon},${fromHit.lat};${toHit.lon},${toHit.lat}?overview=simplified&geometries=geojson`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      return { ok: false as const, error: "The road router is busy. Call 07708 067775 for the fare." };
    }
    const body = (await res.json()) as Parameters<typeof readOsrm>[0];
    return readOsrm(body, fromHit.label, toHit.label);
  });