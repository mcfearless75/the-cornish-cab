import { RouteSketch } from "@/components/route-sketch";
import { BUSINESS, quickJourneys } from "@/lib/content";
import { roadRoute } from "@/lib/road-route";
import { routeGuide } from "@/lib/route.functions";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type RouteResult = {
  miles: number;
  minutes: number;
  fromLabel: string;
  toLabel: string;
  line: [number, number][];
};

type SavedJourney = { from: string; to: string };

const STORE = "cornish-cab-journeys";
const noteChips = ["One suitcase", "A train to meet", "A flight number"];

function readSaved(): SavedJourney[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (item): item is SavedJourney =>
          !!item &&
          typeof item === "object" &&
          typeof (item as SavedJourney).from === "string" &&
          typeof (item as SavedJourney).to === "string",
      )
      .slice(0, 4);
  } catch {
    return [];
  }
}

export function BookingPanel({
  initialFrom = "",
  initialTo = "",
  initialWhen = "",
  heading = "Request a fare",
}: {
  initialFrom?: string;
  initialTo?: string;
  initialWhen?: string;
  heading?: string;
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [when, setWhen] = useState(initialWhen);
  const [asap, setAsap] = useState(initialWhen === "" || initialWhen === "ASAP");
  const [passengers, setPassengers] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [back, setBack] = useState<RouteResult | null>(null);
  const [returning, setReturning] = useState(false);
  const [saved, setSaved] = useState<SavedJourney[]>([]);
  const [routeError, setRouteError] = useState("");
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
    setSaved(readSaved());
  }, []);

  useEffect(() => {
    setFrom(initialFrom);
    setTo(initialTo);
    if (initialWhen && initialWhen !== "ASAP") {
      setAsap(false);
      setWhen(initialWhen);
    }
  }, [initialFrom, initialTo, initialWhen]);

  const whenLabel = asap ? "As soon as possible" : when || "Time to be agreed";

  const message = [
    "The Cornish Cab — booking request",
    `Pickup: ${from.trim() || "—"}`,
    `Destination: ${to.trim() || "—"}`,
    `When: ${whenLabel}`,
    `Passengers: ${passengers} (maximum 3)`,
    name.trim() ? `Name: ${name.trim()}` : "",
    notes.trim() ? `Notes: ${notes.trim()}` : "",
    route
      ? `Out: about ${route.miles} miles, about ${route.minutes} minutes. Not a fare. Traffic not included.`
      : "",
    back
      ? `Return: about ${back.miles} miles, about ${back.minutes} minutes. Same rule. Not a fare.`
      : "",
    "Please confirm availability and the fare from the live road route.",
    "This message is not a confirmed booking.",
  ]
    .filter(Boolean)
    .join("\n");

  async function lookup(pickup: string, drop: string) {
    return import.meta.env.VITE_PAGES === "1"
      ? roadRoute(pickup, drop)
      : routeGuide({ data: { from: pickup, to: drop } });
  }

  function remember(pickup: string, drop: string) {
    const next = [{ from: pickup, to: drop }, ...readSaved().filter((item) => item.from !== pickup || item.to !== drop)].slice(0, 4);
    localStorage.setItem(STORE, JSON.stringify(next));
    setSaved(next);
  }

  async function checkRoute() {
    setRouteError("");
    setRoute(null);
    setBack(null);
    setChecking(true);
    try {
      const result = await lookup(from, to);
      if (!result.ok) {
        setRouteError(result.error);
        return;
      }
      setRoute(result);
      remember(from.trim(), to.trim());
      if (returning) {
        const home = await lookup(to, from);
        if (home.ok) setBack(home);
        else setRouteError(`Outward route is above. The return could not be measured: ${home.error}`);
      }
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : "The route check failed.");
    } finally {
      setChecking(false);
    }
  }

  function swapEnds() {
    setFrom(to);
    setTo(from);
    setRoute(null);
    setBack(null);
  }

  function addNote(chip: string) {
    setNotes((current) => (current.includes(chip) ? current : current ? `${current}. ${chip}` : chip));
  }

  function saveCalendar() {
    if (asap || !when) return;
    const start = new Date(when);
    if (Number.isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + (route?.minutes ?? 30) * 60_000);
    const stamp = (date: Date) => {
      const part = (value: number) => String(value).padStart(2, "0");
      return `${date.getFullYear()}${part(date.getMonth() + 1)}${part(date.getDate())}T${part(date.getHours())}${part(date.getMinutes())}00`;
    };
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Cornish Cab//Request//EN",
      "BEGIN:VEVENT",
      `DTSTART;TZID=Europe/London:${stamp(start)}`,
      `DTEND;TZID=Europe/London:${stamp(end)}`,
      "SUMMARY:Requested taxi — not confirmed",
      `DESCRIPTION:${message.replace(/\n/g, "\\n")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cornish-cab-request.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function shareMessage() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "The Cornish Cab request", text: message });
        return;
      } catch {
        return;
      }
    }
    await copyMessage();
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (!live) {
    return (
      <section className="rounded-3xl border border-line bg-card p-5 sm:p-7">
        <h2 className="text-3xl text-ink">{heading}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
          Check the road distance, then call {BUSINESS.phoneDisplay}. The distance is not a price, and nothing
          is booked until The Cornish Cab confirms the time.
        </p>
      </section>
    );
  }

  const sms = `sms:${BUSINESS.phoneTel}?body=${encodeURIComponent(message)}`;

  return (
    <section className="rounded-3xl border border-line bg-card p-5 shadow-sm sm:p-7">
      <div>
        <h2 className="text-3xl text-ink">{heading}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
          Check the road distance, then call or text. The number you get is not a price. The Cornish Cab
          confirms the fare and whether the time is free.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {saved.length > 0 ? (
          <p className="w-full text-xs font-medium text-mist">On this phone</p>
        ) : null}
        {saved.map((journey) => (
          <button
            key={`${journey.from}-${journey.to}`}
            type="button"
            className="rounded-full border border-pine bg-cream px-3 py-2 text-left text-xs font-medium text-ink"
            onClick={() => {
              setFrom(journey.from);
              setTo(journey.to);
              setRoute(null);
              setBack(null);
            }}
          >
            {journey.from} → {journey.to}
          </button>
        ))}
        {quickJourneys.map((j) => (
          <button
            key={`${j.from}-${j.to}`}
            type="button"
            className="rounded-full border border-line bg-cream px-3 py-2 text-left text-xs font-medium text-ink hover:border-pine"
            onClick={() => {
              setFrom(j.from);
              setTo(j.to);
              setRoute(null);
              setBack(null);
            }}
          >
            {j.from} → {j.to}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Pickup
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-12 rounded-xl border border-line bg-cream px-3 font-normal text-ink"
            placeholder="St Austell railway station"
            autoComplete="off"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Destination
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-12 rounded-xl border border-line bg-cream px-3 font-normal text-ink"
            placeholder="Mevagissey harbour"
            autoComplete="off"
          />
        </label>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium">When</legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAsap(true)}
              className={
                "h-11 rounded-full px-4 text-sm font-medium " +
                (asap ? "bg-gold text-harbour" : "border border-line bg-cream text-ink")
              }
            >
              As soon as possible
            </button>
            <button
              type="button"
              onClick={() => setAsap(false)}
              className={
                "h-11 rounded-full px-4 text-sm font-medium " +
                (!asap ? "bg-pine text-cream" : "border border-line bg-cream text-ink")
              }
            >
              Pre-book a time
            </button>
          </div>
          {!asap ? (
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="h-12 rounded-xl border border-line bg-cream px-3 text-ink"
            />
          ) : null}
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Passengers</legend>
          <div className="mt-2 flex gap-2">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPassengers(n)}
                className={
                  "h-12 w-12 rounded-xl text-sm font-medium tabular-nums " +
                  (passengers === n ? "bg-pine text-cream" : "border border-line bg-cream text-ink")
                }
                aria-pressed={passengers === n}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-mist">Maximum 3. One vehicle.</p>
          <label className="mt-3 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={returning}
              onChange={(event) => {
                setReturning(event.target.checked);
                setBack(null);
              }}
              className="size-4 accent-pine"
            />
            Coming back the same day
          </label>
        </fieldset>
        <label className="grid gap-1.5 text-sm font-medium">
          Name <span className="font-normal text-mist">(optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border border-line bg-cream px-3 font-normal text-ink"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Notes <span className="font-normal text-mist">flight number, train, luggage</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-xl border border-line bg-cream px-3 py-3 font-normal text-ink"
          />
          <span className="flex flex-wrap gap-2 font-normal">
            {noteChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => addNote(chip)}
                className="rounded-full border border-line bg-cream px-3 py-1 text-xs text-ink"
              >
                {chip}
              </button>
            ))}
          </span>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={checkRoute}
          disabled={checking}
          className="inline-flex h-12 items-center rounded-full bg-clay px-5 text-sm font-medium text-cream disabled:opacity-60"
        >
          {checking ? "Checking the road…" : "Check road route"}
        </button>
        <button
          type="button"
          onClick={swapEnds}
          className="inline-flex h-12 items-center rounded-full border border-line bg-cream px-5 text-sm font-medium text-ink"
        >
          Swap ends
        </button>
        <a
          href={`tel:${BUSINESS.phoneTel}`}
          className="inline-flex h-12 items-center rounded-full bg-pine px-5 text-sm font-medium text-cream"
        >
          Call {BUSINESS.phoneDisplay}
        </a>
        <a
          href={sms}
          className="inline-flex h-12 items-center rounded-full border border-line bg-cream px-5 text-sm font-medium text-ink"
        >
          Text this request
        </a>
        {!asap && when ? (
          <button
            type="button"
            onClick={saveCalendar}
            className="inline-flex h-12 items-center rounded-full border border-line bg-cream px-5 text-sm font-medium text-ink"
          >
            Save the time
          </button>
        ) : null}
        <button
          type="button"
          onClick={shareMessage}
          className="inline-flex h-12 items-center rounded-full border border-line bg-cream px-5 text-sm font-medium text-ink"
        >
          Share
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-mist">
        Route check uses OpenStreetMap to measure driving distance. The saved journeys stay on this phone.
        It is not a booking and not a fare.
      </p>

      {routeError ? (
        <p className="mt-4 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink" role="alert">
          {routeError}
        </p>
      ) : null}

      {route ? (
        <div className="mt-4 rounded-2xl bg-pine px-5 py-4 text-cream">
          <p className="text-sm text-cream/80">Road route guide · not a fare</p>
          <p className="mt-1 font-display text-3xl tabular-nums">
            {route.miles} miles
            <span className="mx-2 text-cream/50">·</span>
            about {route.minutes} min
          </p>
          {back ? (
            <p className="mt-1 font-display text-xl tabular-nums text-gold">
              Back: {back.miles} miles · about {back.minutes} min
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-relaxed text-cream/85">
            {route.fromLabel} to {route.toLabel}. Traffic is not included. Call to turn this into a confirmed
            fare and a confirmed time.
          </p>
          <RouteSketch line={route.line} />
          <p className="mt-2 text-xs text-cream/70">Cream dot is the pickup. Clay dot is the drop. Not a satnav.</p>
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-dashed border-line bg-cream p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">What to read out</p>
          <button type="button" onClick={copyMessage} className="text-sm font-medium text-pine">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{message}</pre>
      </div>
      <p className="mt-4 text-sm text-mist">
        Prefer to browse first?{" "}
        <Link to="/areas" className="font-medium text-pine">
          See the places this cab covers
        </Link>
        .
      </p>
    </section>
  );
}
