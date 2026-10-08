type Hit = { lat: number; lon: number; label: string };

export type RoadRoute =
  | { ok: true; miles: number; minutes: number; fromLabel: string; toLabel: string }
  | { ok: false; error: string };

function clean(value: string) {
  return value.trim();
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
  const url = `https://router.project-osrm.org/route/v1/driving/${fromHit.lon},${fromHit.lat};${toHit.lon},${toHit.lat}?overview=false`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    return { ok: false, error: "The road router is busy. Call 07708 067775 for the fare." };
  }
  const body = (await res.json()) as {
    code?: string;
    routes?: { distance?: number; duration?: number }[];
  };
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
    fromLabel: fromHit.label,
    toLabel: toHit.label,
  };
}

async function geocode(query: string): Promise<Hit | null> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "1");
  url.searchParams.set("lat", "50.34");
  url.searchParams.set("lon", "-4.79");
  const res = await fetch(url);
  if (!res.ok) return null;
  const body = (await res.json()) as {
    features?: { geometry?: { coordinates?: number[] }; properties?: { name?: string; city?: string; state?: string } }[];
  };
  const feature = body.features?.[0];
  const [lon, lat] = feature?.geometry?.coordinates ?? [];
  if (typeof lat !== "number" || typeof lon !== "number") return null;
  const props = feature?.properties;
  const label = [props?.name, props?.city, props?.state].filter(Boolean).join(", ") || query;
  return { lat, lon, label };
}
