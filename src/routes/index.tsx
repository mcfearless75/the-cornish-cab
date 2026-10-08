import { AskPanel } from "@/components/ask-panel";
import { BookingPanel } from "@/components/booking-panel";
import { SiteShell } from "@/components/site-shell";
import { BUSINESS, places, services, whatsappHref } from "@/lib/content";
import { publicUrl } from "@/lib/public-url";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "The Cornish Cab | St Austell taxi",
      description:
        "Independent St Austell taxi. One driver, one vehicle, maximum three passengers. Airport, station and local journeys. Call 07708 067775. Fare confirmed from the live road route.",
      path: "/",
      origin,
      schemas: [taxiGraph(origin), breadcrumb(origin, [{ name: "Home", path: "/" }])],
    });
  },
  component: Home,
});

const calls = [
  "Newquay Airport, after the school run — three of us.",
  "Par station, the evening train, one suitcase.",
  "Eden Project, timed entry, can you wait?",
  "Charlestown and back. We’re early.",
];

const marks = [
  ["Local", "St Austell and the villages"],
  ["One driver", "One vehicle, no fleet"],
  ["Three seats", "Maximum, including you"],
  ["Further out", "Airports, stations, coast"],
];

function Home() {
  return (
    <SiteShell>
      <section className="bg-harbour text-cream">
        <figure className="relative">
          <img
            src={publicUrl("media/charlestown-dusk.jpg")}
            alt="Charlestown harbour in the evening, with lit cottages and boats on the water"
            width={1792}
            height={1008}
            className="h-80 w-full object-cover sm:h-[28rem]"
          />
          <figcaption className="absolute bottom-4 left-4 bg-harbour px-3 py-2 text-sm text-cream">
            Charlestown, after the light goes.
          </figcaption>
        </figure>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm font-medium tracking-wide text-gold">St Austell · one cab</p>
          <h1 className="mt-2 max-w-3xl text-5xl leading-none sm:text-6xl">
            Three seats. The rest of the coast if you book it.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/85">{BUSINESS.description}</p>
          <a
            href={whatsappHref("Hello, I would like to book The Cornish Cab.")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex h-16 items-center justify-center gap-3 rounded-full border-2 border-gold px-5 text-cream"
          >
            <span className="font-display text-2xl tracking-wide">WhatsApp {BUSINESS.phoneDisplay}</span>
          </a>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {marks.map(([title, line]) => (
              <li key={title} className="border-t border-gold/50 pt-3">
                <p className="font-display text-lg">{title}</p>
                <p className="mt-1 text-xs text-cream/70">{line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="overflow-hidden border-y border-gold/40 bg-harbour text-cream">
        <div className="lane-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
              {places.map((place) => (
                <li key={`${copy}-${place.slug}`}>
                  <Link
                    to="/areas/$slug"
                    params={{ slug: place.slug }}
                    className="inline-flex items-center px-5 py-3 font-display text-lg whitespace-nowrap hover:text-gold"
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    {place.name}
                    <span className="ml-5 text-gold" aria-hidden="true">
                      /
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className="bg-cream-deep">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-4xl text-ink">What people actually ring up and say.</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Not reviews. Just the shape of the job. The answer is still “let me check the diary.”
            </p>
          </div>
          <ul className="grid gap-3 lg:col-span-8">
            {calls.map((line) => (
              <li
                key={line}
                className="border-l-4 border-gold bg-card px-5 py-4 font-display text-2xl leading-snug text-ink"
              >
                “{line}”
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="book" className="bg-harbour">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="mb-4 text-sm font-medium tracking-wide text-gold">The diary</p>
          <BookingPanel heading="Where are you, and where are you going?" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl text-ink">Four jobs. Not a fleet.</h2>
          <Link to="/services" className="hidden text-sm font-medium text-pine sm:inline">
            The long version
          </Link>
        </div>
        <ol className="mt-6">
          {services.map((service, index) => (
            <li key={service.slug} className="grid gap-2 border-t border-line py-6 sm:grid-cols-12 sm:items-baseline">
              <p className="font-display text-3xl text-clay tabular-nums sm:col-span-2">0{index + 1}</p>
              <h3 className="text-2xl text-ink sm:col-span-4">{service.name}</h3>
              <p className="text-sm leading-relaxed text-mist sm:col-span-6">{service.summary}</p>
            </li>
          ))}
        </ol>
        <p className="border-t border-line pt-4 text-sm">
          <Link to="/airport-transfers" className="font-medium text-pine">
            Airports
          </Link>
          <span className="text-mist"> · </span>
          <Link to="/train-stations" className="font-medium text-pine">
            Stations
          </Link>
          <span className="text-mist"> · </span>
          <Link to="/services" className="font-medium text-pine sm:hidden">
            All services
          </Link>
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl items-end gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-12">
        <figure className="lg:col-span-7">
          <img
            src={publicUrl("media/clay-country.jpg")}
            alt="A wet lane between high Cornish hedges, with white china-clay tips in the distance"
            width={1728}
            height={1152}
            className="aspect-clay w-full object-cover"
          />
        </figure>
        <div className="lg:col-span-5 lg:pb-6">
          <p className="font-display text-4xl leading-tight text-ink">
            White tips, wet hedges, then the harbour. That’s the patch.
          </p>
          <p className="mt-4 leading-relaxed text-mist">
            Based in St Austell. Out to the coast, the gardens, the stations and the airports people actually ask for.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {places
              .filter((place) => place.group === "Coast" || place.group === "Days out")
              .map((place) => (
                <li key={place.slug}>
                  <Link
                    to="/areas/$slug"
                    params={{ slug: place.slug }}
                    className="inline-flex h-10 items-center rounded-full bg-harbour px-3 text-sm font-medium text-cream hover:bg-pine"
                  >
                    {place.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <AskPanel />
      </section>
    </SiteShell>
  );
}
