import { factsBrief } from "@/lib/content";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

type Turn = { role: "user" | "assistant"; content: string };

const hits = new Map<string, number[]>();

function allow(key: string): boolean {
  const now = Date.now();
  const fresh = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (fresh.length >= 6) {
    hits.set(key, fresh);
    return false;
  }
  fresh.push(now);
  hits.set(key, fresh);
  if (hits.size > 400) {
    const oldest = hits.keys().next().value;
    if (oldest) hits.delete(oldest);
  }
  return true;
}

function parseTurns(input: unknown): Turn[] {
  if (!input || typeof input !== "object" || !("messages" in input)) {
    throw new Error("Ask a short question about a journey.");
  }
  const raw = (input as { messages: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 8) {
    throw new Error("Ask a short question about a journey.");
  }
  const turns = raw.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Ask a short question about a journey.");
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      throw new Error("Ask a short question about a journey.");
    }
    const text = content.trim();
    if (!text || text.length > 500) throw new Error("Keep the question under 500 characters.");
    return { role, content: text } as Turn;
  });
  if (turns[turns.length - 1]?.role !== "user") {
    throw new Error("Ask a short question about a journey.");
  }
  return turns;
}

export const askCab = createServerFn({ method: "POST" })
  .validator((input: { messages: { role: "user" | "assistant"; content: string }[] }) => parseTurns(input))
  .handler(async ({ data }) => {
    let key = "anon";
    try {
      key = getRequestIP({ xForwardedFor: true }) || "anon";
    } catch {
      key = "anon";
    }
    if (!allow(key)) {
      return {
        ok: false as const,
        error: "Too many questions just now. Call 07708 067775 or wait a minute.",
      };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "The assistant is not available right now. Call 07708 067775." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 320,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: [
              "You answer questions for The Cornish Cab, an independent taxi in St Austell, Cornwall.",
              "Write plain British English in short paragraphs. No markdown, no asterisks, no headings.",
              "Use ONLY the facts below. If a detail is missing, say you do not know and that the driver confirms it on 07708 067775.",
              "Never invent a price, licence number, vehicle make, registration, email, street address, clock-time hours, payment method, child seat, wheelchair access, or reviews.",
              "Never say a journey is booked or confirmed. Confirmation happens only after an availability check.",
              "Road distance is not a fare. This chat cannot quote a guaranteed fare.",
              "If the question is not about this taxi, say so in one sentence and point back to booking.",
              "When a trip is being discussed, end by inviting a WhatsApp message to 07708 067775. Do not say the journey is booked.",
              "",
              "FACTS:",
              factsBrief(),
            ].join("\n"),
          },
          ...data.map((turn) => ({ role: turn.role, content: turn.content })),
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: "The assistant could not answer just now. Call 07708 067775." };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { ok: false as const, error: "No answer came back. Call 07708 067775." };
    }
    return { ok: true as const, text };
  });
