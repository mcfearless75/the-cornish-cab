import { createServerFn } from "@tanstack/react-start";
import { suggestAddresses } from "@/lib/places";
import { getRequestIP } from "@tanstack/react-start/server";

const hits = new Map<string, number[]>();

function allow(key: string) {
  const now = Date.now();
  const fresh = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (fresh.length >= 40) {
    hits.set(key, fresh);
    return false;
  }
  fresh.push(now);
  hits.set(key, fresh);
  return true;
}

export const suggestPlaces = createServerFn({ method: "POST" })
  .validator((input: { query: string }) => {
    if (!input || typeof input !== "object") throw new Error("Type a place.");
    const query = (input as { query?: unknown }).query;
    if (typeof query !== "string") throw new Error("Type a place.");
    const text = query.trim();
    if (text.length < 3 || text.length > 140) throw new Error("Type a little more of the place.");
    return { query: text };
  })
  .handler(async ({ data }) => {
    let key = "anon";
    try {
      key = getRequestIP({ xForwardedFor: true }) || "anon";
    } catch {
      key = "anon";
    }
    if (!allow(key)) return { ok: true as const, suggestions: [] as string[], source: "map" as const };
    const found = await suggestAddresses(data.query);
    return { ok: true as const, ...found };
  });
