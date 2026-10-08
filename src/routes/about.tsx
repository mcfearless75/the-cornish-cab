import { SiteShell } from "@/components/site-shell";
import { publicUrl } from "@/lib/public-url";
import { BUSINESS } from "@/lib/content";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "About The Cornish Cab | St Austell",
      description:
        "The Cornish Cab is an independent taxi in St Austell, Cornwall. One driver, one vehicle, maximum three passengers. Phone 07708 067775.",
      path: "/about",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    });
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-clay">About</p>
          <h1 className="mt-2 text-5xl text-ink">One driver. One vehicle.</h1>
          <p className="mt-5 text-lg leading-relaxed">{BUSINESS.description}</p>
          <p className="mt-4 leading-relaxed text-mist">
            There is no published street address, email, licence number or vehicle registration on the public
            listing, so this site does not invent them. The way to book is the phone: {BUSINESS.phoneDisplay}.
            Your booking is checked manually before it is confirmed.
          </p>
          <p className="mt-4 leading-relaxed text-mist">
            Search engines and AI assistants are given the same paragraph you just read — via the page text,
            taxi schema, a sitemap, and a plain-language file at{" "}
            <a className="text-pine underline" href={publicUrl("llms.txt")}>
              /llms.txt
            </a>
            . They are not given made-up reviews or a made-up price list.
          </p>
          <p className="mt-6">
            <Link to="/book" className="inline-flex h-12 items-center rounded-full bg-pine px-5 text-sm font-medium text-cream">
              Request a journey
            </Link>
          </p>
        </div>
        <figure>
          <img
            src={publicUrl("media/clay-country.jpg")}
            alt="China-clay country lane near St Austell, with white tips beyond the hedges"
            width={1728}
            height={1152}
            className="aspect-clay w-full rounded-3xl object-cover"
          />
          <figcaption className="mt-3 text-sm text-mist">
            China-clay country outside St Austell. The cab is based in the town, not on a particular tip.
          </figcaption>
        </figure>
      </article>
    </SiteShell>
  );
}
