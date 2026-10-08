import { SiteShell } from "@/components/site-shell";
import { places } from "@/lib/content";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/train-stations")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Train station taxis in St Austell | The Cornish Cab",
      description:
        "Taxis for St Austell station, Par station and Lostwithiel. The Cornish Cab meets trains by arrangement. Call 07708 067775. Maximum three passengers.",
      path: "/train-stations",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Train stations", path: "/train-stations" },
        ]),
      ],
    });
  },
  component: StationsPage,
});

function StationsPage() {
  const stations = places.filter((p) => p.group === "Stations" || p.slug === "lostwithiel");
  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Stations</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">From the platform to the door.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          Train station transfers are a core part of the work. Tell the driver which train, and treat the
          job as booked only after they confirm they are free.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {stations.map((p) => (
            <li key={p.slug} className="rounded-3xl border border-line bg-card p-6">
              <h2 className="text-2xl text-ink">{p.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{p.lede}</p>
              <Link to="/areas/$slug" params={{ slug: p.slug }} className="mt-4 inline-flex font-medium text-pine">
                Read more
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link to="/book" search={{ from: "St Austell railway station" }} className="font-medium text-pine">
            Start a station booking
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
