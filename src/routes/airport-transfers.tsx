import { SiteShell } from "@/components/site-shell";
import { places } from "@/lib/content";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/airport-transfers")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Airport transfers from St Austell | The Cornish Cab",
      description:
        "Pre-booked taxis from St Austell to Cornwall Airport Newquay, Exeter Airport and Bristol Airport. The Cornish Cab, 07708 067775. Maximum three passengers.",
      path: "/airport-transfers",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Airport transfers", path: "/airport-transfers" },
        ]),
      ],
    });
  },
  component: AirportsPage,
});

function AirportsPage() {
  const airports = places.filter((p) => p.group === "Airports");
  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Airports</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">Airport transfers, pre-booked.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          The Cornish Cab takes airport work from St Austell. Pre-booking is recommended, especially when the
          airport is a long way from home. One driver, one vehicle, maximum three passengers.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-mist">
          Add the flight number in the notes. This website does not monitor flights. The fare is worked out
          from the live road route and agreed before the booking is confirmed. Weekday trips sit outside
          school-run times. Weekends and school holidays are available.
        </p>
        <ul className="mt-10 grid gap-4">
          {airports.map((p) => (
            <li key={p.slug} className="rounded-3xl border border-line bg-card p-6">
              <h2 className="text-2xl text-ink">{p.name}</h2>
              <p className="mt-2 leading-relaxed text-mist">{p.lede}</p>
              <Link
                to="/areas/$slug"
                params={{ slug: p.slug }}
                className="mt-3 inline-flex font-medium text-pine"
              >
                Details and how to book
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </SiteShell>
  );
}
