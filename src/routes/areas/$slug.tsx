import { SiteShell } from "@/components/site-shell";
import { publicUrl } from "@/lib/public-url";
import { placeBySlug } from "@/lib/content";
import { breadcrumb, originFromMatches, placeSchema, seoHead } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const place = placeBySlug(params.slug);
    if (!place) throw notFound();
    return place;
  },
  head: ({ matches, loaderData, params }) => {
    const origin = originFromMatches(matches);
    const place = loaderData ?? placeBySlug(params.slug);
    if (!place) return { meta: [{ title: "Area | The Cornish Cab" }] };
    return seoHead({
      title: `${place.name} taxi | The Cornish Cab, St Austell`,
      description: place.description,
      path: `/areas/${place.slug}`,
      origin,
      schemas: [
        placeSchema(origin, place.slug),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Areas", path: "/areas" },
          { name: place.name, path: `/areas/${place.slug}` },
        ]),
      ],
    });
  },
  component: PlacePage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl">That place is not listed.</h1>
        <Link to="/areas" className="mt-4 inline-flex text-pine">
          All areas
        </Link>
      </div>
    </SiteShell>
  ),
});

function PlacePage() {
  const place = Route.useLoaderData();
  const showHarbour = place.slug === "charlestown";
  const showClay = place.slug === "st-austell" || place.slug === "eden-project";
  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">{place.group}</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">{place.name} taxi</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">{place.lede}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-mist">{place.body}</p>
        {showHarbour ? (
          <figure className="mt-8 max-w-3xl">
            <img
              src={publicUrl("media/charlestown.jpg")}
              alt="Fishing boats in Charlestown harbour"
              width={1792}
              height={1008}
              className="aspect-video w-full rounded-3xl object-cover"
            />
          </figure>
        ) : null}
        {showClay ? (
          <figure className="mt-8 max-w-3xl">
            <img
              src={publicUrl("media/clay-country.jpg")}
              alt="Lane through the china-clay country near St Austell"
              width={1728}
              height={1152}
              className="aspect-clay w-full rounded-3xl object-cover"
            />
          </figure>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/book"
            search={{ from: "St Austell", to: place.name }}
            className="inline-flex h-12 items-center rounded-full bg-pine px-5 text-sm font-medium text-cream"
          >
            Request this journey
          </Link>
          <a
            href="tel:+447708067775"
            className="inline-flex h-12 items-center rounded-full border border-line bg-card px-5 text-sm font-medium"
          >
            Call 07708 067775
          </a>
        </div>
      </article>
    </SiteShell>
  );
}
