import { SiteShell } from "@/components/site-shell";
import { services } from "@/lib/content";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

const extra: Record<string, string> = {
  local:
    "Local means St Austell and the villages around it: Charlestown, Carlyon Bay, Par, Mevagissey, and similar hops. If it is a school day, bookings are outside school-run times. Say how many of you are travelling. Three is the maximum.",
  airports:
    "Newquay is the local airport. Exeter and Bristol are longer and should be arranged ahead. Put the flight number in the notes. This site does not watch flight arrivals for you. The fare is the road route, confirmed before you travel, not a flat airport tariff printed here.",
  stations:
    "St Austell station is in town. Par is the junction for the Newquay branch and a sensible pickup for the beach and Fowey. Lostwithiel is on the main line further up the valley. Name the train. A late train is still subject to the driver being free.",
  prebook:
    "Pre-booking is how longer days, early flights and weekend plans get a proper answer. The request on this website is a script you can read out or text. It is not itself the confirmation.",
};

export const Route = createFileRoute("/services")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Taxi services in St Austell | The Cornish Cab",
      description:
        "Local journeys, airport transfers, train station transfers and pre-booked trips with The Cornish Cab. One driver in St Austell. Call 07708 067775.",
      path: "/services",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
      ],
    });
  },
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Services</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">Four jobs. One vehicle.</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">
          The Cornish Cab is not a radio circuit and not a coach firm. These are the services named on the
          original listing, written so a person — or a search engine — can quote them without inventing the rest.
        </p>
        <div className="mt-10 grid gap-6">
          {services.map((s) => (
            <section key={s.slug} className="rounded-3xl border border-line bg-card p-6 sm:p-8">
              <h2 className="text-3xl text-ink">{s.name}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed">{s.summary}</p>
              <p className="mt-3 max-w-3xl leading-relaxed text-mist">{extra[s.slug]}</p>
            </section>
          ))}
        </div>
        <p className="mt-8">
          <Link to="/book" className="inline-flex h-12 items-center rounded-full bg-pine px-5 text-sm font-medium text-cream">
            Check a route and request the fare
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
