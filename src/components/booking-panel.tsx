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
};

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
  const [routeError, setRouteError] = useState("");
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
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
      ? `Road route guide: about ${route.miles} miles, about ${route.minutes} minutes. Not a fare. Traffic not included.`
      : "",
    "Please confirm availability and the fare from the live road route.",
    "This message is not a confirmed booking.",
  ]
    .filter(Boolean)
    .join("\n");

  async function checkRoute() {
    setRouteError("");
    setRoute(null);
    setChecking(true);
    try {
      const result =
        import.meta.env.VITE_PAGES === "1" ? await roadRoute(from, to) : await routeGuide({ data: { from, to } });
      if (!result.ok) setRouteError(result.error);
      else setRoute(result);
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : "The route check failed.");
    } finally {
      setChecking(false);
    }
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
        {quickJourneys.map((j) => (
          <button
            key={`${j.from}-${j.to}`}
            type="button"
            className="rounded-full border border-line bg-cream px-3 py-2 text-left text-xs font-medium text-ink hover:border-pine"
            onClick={() => {
              setFrom(j.from);
              setTo(j.to);
              setRoute(null);
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
      </div>
      <p className="mt-3 text-xs leading-relaxed text-mist">
        Route check uses OpenStreetMap to measure driving distance. It is not a booking and not a fare.
        Nothing is stored on this website.
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
          <p className="mt-2 text-sm leading-relaxed text-cream/85">
            {route.fromLabel} to {route.toLabel}. Traffic is not included. Call to turn this into a confirmed
            fare and a confirmed time.
          </p>
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
