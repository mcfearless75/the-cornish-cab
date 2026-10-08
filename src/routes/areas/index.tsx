import { SiteShell } from "@/components/site-shell";
import { places, type Place } from "@/lib/content";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/areas/")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Taxi areas around St Austell | The Cornish Cab",
      description:
        "Where The Cornish Cab runs from St Austell: coast, towns, the Eden Project, Heligan, stations and airports. Call 07708 067775.",
      path: "/areas",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Areas", path: "/areas" },
        ]),
      ],
    });
  },
  component: AreasPage,
});

const groups: Place["group"][] = ["Coast", "Towns", "Days out", "Stations", "Airports"];

function AreasPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Areas</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">Places people ask to be taken.</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">
          These are real places around the St Austell base. Covering a place means the cab can be booked
          for a journey there — not that it is the official taxi of that harbour, garden or airport.
        </p>
        <div className="mt-10 grid gap-10">
          {groups.map((group) => (
            <section key={group}>
              <h2 className="text-2xl text-ink">{group}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {places
                  .filter((p) => p.group === group)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/areas/$slug"
                        params={{ slug: p.slug }}
                        className="block rounded-2xl border border-line bg-card p-4 hover:border-pine"
                      >
                        <span className="font-medium text-ink">{p.name}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-mist">{p.lede}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
