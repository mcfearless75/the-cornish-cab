import { BUSINESS, faqs, whatsappHref } from "@/lib/content";
import { askCab } from "@/lib/ask.functions";
import { useEffect, useState } from "react";

const SUGGESTIONS = [
  "Can you take three of us to Newquay Airport?",
  "Are you free during the school run?",
  "How do I book a pickup at St Austell station?",
  "Do you go to the Eden Project?",
  "Does this website show a fixed fare?",
];

function pagesAnswer(question: string): string {
  const q = question.toLowerCase();
  const hit = faqs.find((faq) => {
    const words = faq.q.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
    return words.some((word) => q.includes(word));
  });
  if (hit) return `${hit.a} WhatsApp ${BUSINESS.phoneDisplay} to book. Nothing is confirmed until the driver replies.`;
  if (/fare|price|cost|how much/.test(q)) {
    return `The fare on this site is £3.75 per mile of the live road route. Traffic is not included, and it is not booked until The Cornish Cab replies. WhatsApp ${BUSINESS.phoneDisplay}.`;
  }
  return `${BUSINESS.description} WhatsApp ${BUSINESS.phoneDisplay}.`;
}

type Turn = { role: "user" | "assistant"; content: string };

export function AskPanel() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    setError("");
    const next = [...turns, { role: "user" as const, content }];
    setTurns(next);
    setQuestion("");
    setPending(true);
    if (import.meta.env.VITE_PAGES === "1") {
      setTurns([...next, { role: "assistant", content: pagesAnswer(content) }]);
      setPending(false);
      return;
    }
    try {
      const result = await askCab({ data: { messages: next } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setTurns([...next, { role: "assistant", content: result.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not answer.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-card p-5 sm:p-7">
      <h2 className="text-3xl text-ink">Ask the cab. Then WhatsApp it.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        It only knows what this site says. It will not invent a fare or pretend you are booked.
        Enquiries go to {BUSINESS.phoneDisplay} on WhatsApp.
        {import.meta.env.VITE_PAGES === "1"
          ? " On this copy it answers from the published questions, not a live model."
          : ""}
      </p>
      {live ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending}
            onClick={() => send(s)}
            className="rounded-full border border-line bg-cream px-3 py-2 text-left text-xs font-medium text-ink hover:border-pine disabled:opacity-60"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3" aria-live="polite">
        {turns.map((turn, i) => (
          <p
            key={`${turn.role}-${i}`}
            className={
              "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed " +
              (turn.role === "user" ? "ml-auto bg-pine text-cream" : "bg-cream text-ink")
            }
          >
            {turn.content}
          </p>
        ))}
        {pending ? <p className="text-sm text-mist">Checking the published facts…</p> : null}
        {error ? (
          <p className="text-sm text-clay" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void send(question);
        }}
      >
        <label className="sr-only" htmlFor="ask-cab">
          Question
        </label>
        <input
          id="ask-cab"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          placeholder="Ask about a journey, the hours, or how booking works"
          className="h-12 flex-1 rounded-xl border border-line bg-cream px-3 text-ink"
        />
        <button
          type="submit"
          disabled={pending || !question.trim()}
          className="h-12 rounded-full bg-pine px-5 text-sm font-medium text-cream disabled:opacity-60"
        >
          Ask
        </button>
      </form>
      <a
        href={whatsappHref(
          turns.some((turn) => turn.role === "user")
            ? `The Cornish Cab — enquiry\n${turns
                .filter((turn) => turn.role === "user")
                .map((turn) => turn.content)
                .join("\n")}\nThis message is not a confirmed booking.`
            : "Hello, I have a question for The Cornish Cab.",
        )}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-12 items-center justify-center self-start rounded-full bg-gold px-5 text-sm font-semibold text-harbour"
      >
        Send this enquiry on WhatsApp
      </a>
        </>
      ) : null}
    </section>
  );
}
