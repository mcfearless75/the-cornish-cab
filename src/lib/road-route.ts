import { preferSouthWest } from "@/lib/places";

export type RoadRoute =
  | {
      ok: true;
      miles: number;
      minutes: number;
      fromLabel: string;
      toLabel: string;
      line: [number, number][];
    }
  | { ok: false; error: string };

type Hit = { lat: number; lon: number; label: string };

function clean(value: string) {
  return value.trim();
}

function thin(coords: [number, number][] | undefined): [number, number][] {
  if (!coords?.length) return [];
  const max = 40;
  if (coords.length <= max) return coords;
  const step = (coords.length - 1) / (max - 1);
  const out: [number, number][] = [];
  for (let i = 0; i < max; i++) {
    const point = coords[Math.round(i * step)];
    if (point) out.push([point[0], point[1]]);
  }
  return out;
}

export function readOsrm(
  body: {
    code?: string;
    routes?: { distance?: number; duration?: number; geometry?: { coordinates?: [number, number][] } }[];
  },
  fromLabel: string,
  toLabel: string,
): RoadRoute {
  const route = body.routes?.[0];
  if (body.code !== "Ok" || !route?.distance || !route.duration) {
    return {
      ok: false,
      error: "No driving route came back. Call 07708 067775 and the driver will use the live road route.",
    };
  }
  return {
    ok: true,
    miles: Math.round((route.distance / 1609.344) * 10) / 10,
    minutes: Math.max(1, Math.round(route.duration / 60)),
    fromLabel,
    toLabel,
    line: thin(route.geometry?.coordinates),
  };
}

/** Browser route check for the static GitHub Pages copy. Nominatim blocks browsers; Photon allows them. */
export async function roadRoute(from: string, to: string): Promise<RoadRoute> {
  const pickup = clean(from);
  const drop = clean(to);
  if (pickup.length < 3 || drop.length < 3 || pickup.length > 140 || drop.length > 140) {
    return { ok: false, error: "Use a place name for both ends, under 140 characters." };
  }
  const fromHit = await geocode(pickup);
  const toHit = await geocode(drop);
  if (!fromHit || !toHit) {
    return {
      ok: false,
      error: "Those places could not be found on the map. Call 07708 067775 and read the addresses out.",
    };
  }
  const url = `https://router.project-osrm.org/route/v1/driving/${fromHit.lon},${fromHit.lat};${toHit.lon},${toHit.lat}?overview=simplified&geometries=geojson`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    return { ok: false, error: "The road router is busy. Call 07708 067775 for the fare." };
  }
  const body = (await res.json()) as Parameters<typeof readOsrm>[0];
  return readOsrm(body, fromHit.label, toHit.label);
}

async function geocode(query: string): Promise<Hit | null> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lat", "50.34");
  url.searchParams.set("lon", "-4.79");
  const res = await fetch(url);
  if (!res.ok) return null;
  const body = (await res.json()) as {
    features?: {
      geometry?: { coordinates?: number[] };
      properties?: { name?: string; city?: string; county?: string; state?: string };
    }[];
  };
  const hits = (body.features ?? []).flatMap((feature) => {
    const [lon, lat] = feature.geometry?.coordinates ?? [];
    if (typeof lat !== "number" || typeof lon !== "number") return [];
    const props = feature.properties;
    const label = [props?.name, props?.city || props?.county, props?.state].filter(Boolean).join(", ") || query;
    return [{ lat, lon, label }];
  });
  return preferSouthWest(hits);
}
