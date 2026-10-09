const SUGGEST_URL = "https://cornish-cab-routing.thecornishcab-143.workers.dev/api/suggest";

export function inSouthWest(lat: number, lon: number) {
  return lat >= 49.85 && lat <= 51.65 && lon >= -5.95 && lon <= -2.05;
}

export function preferSouthWest<T extends { lat: number; lon: number }>(hits: T[]): T | null {
  return hits.find((hit) => inSouthWest(hit.lat, hit.lon)) ?? hits[0] ?? null;
}

export async function suggestAddresses(query: string): Promise<{ suggestions: string[]; source: "google" | "map" }> {
  const q = query.trim();
  if (q.length < 3 || q.length > 140) return { suggestions: [], source: "map" };
  try {
    const res = await fetch(SUGGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ input: `${q}, UK` }),
    });
    if (res.ok) {
      const body = (await res.json()) as { suggestions?: unknown };
      const suggestions = (Array.isArray(body.suggestions) ? body.suggestions : [])
        .map((item) => {
          if (typeof item === "string") return item;
          if (!item || typeof item !== "object") return "";
          const row = item as { text?: unknown };
          return typeof row.text === "string" ? row.text : "";
        })
        .filter(Boolean)
        .slice(0, 5);
      if (suggestions.length) return { suggestions, source: "google" };
    }
  } catch {
    // Fall through to the map search.
  }
  return { suggestions: await photonSuggestions(q), source: "map" };
}

async function photonSuggestions(query: string): Promise<string[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "6");
  url.searchParams.set("lat", "50.34");
  url.searchParams.set("lon", "-4.79");
  url.searchParams.set("lang", "en");
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const body = (await res.json()) as {
    features?: {
      geometry?: { coordinates?: number[] };
      properties?: { name?: string; street?: string; city?: string; county?: string; state?: string };
    }[];
  };
  const labels = (body.features ?? [])
    .map((feature) => {
      const [lon, lat] = feature.geometry?.coordinates ?? [];
      const props = feature.properties;
      const label = [props?.name, props?.street, props?.city || props?.county, props?.state].filter(Boolean).join(", ");
      return { lat, lon, label };
    })
    .filter((hit) => typeof hit.lat === "number" && typeof hit.lon === "number" && hit.label);
  const local = labels.filter((hit) => inSouthWest(hit.lat as number, hit.lon as number));
  return (local.length ? local : labels).map((hit) => hit.label).slice(0, 5);
}

/** Use a suggested place when the typed words do not already land in the South West. */
export async function clarifyPlace(query: string): Promise<string[]> {
  const typed = query.trim();
  const { suggestions } = await suggestAddresses(typed);
  const primary = suggestions[0]?.split(",")[0]?.trim();
  const attempts = [typed];
  if (suggestions[0] && suggestions[0].toLowerCase() !== typed.toLowerCase()) attempts.push(suggestions[0]);
  if (primary && !attempts.some((item) => item.toLowerCase() === primary.toLowerCase())) attempts.push(`${primary}, Cornwall`);
  return attempts;
}

export function placeAttempts(query: string): string[] {
  const parts = query
    .split(",")
    .map((part) => part.replace(/\bhotel\b/gi, "").replace(/\s+/g, " ").trim())
    .filter((part) => part && !/^(uk|united kingdom)$/i.test(part));
  const attempts: string[] = [];
  const add = (value: string) => {
    const text = value.replace(/\s+/g, " ").trim();
    if (text.length < 3 || attempts.some((item) => item.toLowerCase() === text.toLowerCase())) return;
    attempts.push(text);
  };
  add(parts.join(", "));
  const name = parts[0] ?? "";
  const town = parts[parts.length - 1] ?? "";
  if (parts.length >= 3) {
    const brand = name.split(/\s+/).slice(0, 2).join(" ");
    for (let i = 1; i < parts.length - 1; i++) {
      add(`${name}, ${parts[i]}`);
      add(`${brand} ${parts[i]}`);
    }
    add(`${parts[1]}, ${town}`);
  }
  if (name && town && name.toLowerCase() !== town.toLowerCase()) add(`${name}, ${town}`);
  add(name);
  return attempts;
}
