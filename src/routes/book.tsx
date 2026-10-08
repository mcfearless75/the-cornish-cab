import { BookingPanel } from "@/components/booking-panel";
import { SiteShell } from "@/components/site-shell";
import { breadcrumb, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => {
    const from = typeof search.from === "string" ? search.from.slice(0, 140) : "";
    const to = typeof search.to === "string" ? search.to.slice(0, 140) : "";
    const when = typeof search.when === "string" ? search.when.slice(0, 40) : "";
    const result: { from?: string; to?: string; when?: string } = {};
    if (from) result.from = from;
    if (to) result.to = to;
    if (when) result.when = when;
    return result;
  },
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Book a taxi | The Cornish Cab, St Austell",
      description:
        "Request a St Austell taxi with The Cornish Cab. Check the live road distance, then call 07708 067775. Not confirmed until availability is checked. Maximum three passengers.",
      path: "/book",
      origin,
      schemas: [
        taxiGraph(origin),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "Book", path: "/book" },
        ]),
      ],
    });
  },
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Booking</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">Get the road route, then get a yes.</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">
          Fill in the journey and check the driving distance. Call or text the summary to 07708 067775.
          The Cornish Cab works the fare from the live road route and only confirms the job if the time is free.
        </p>
        <div className="mt-8">
          <BookingPanel
            initialFrom={search.from ?? ""}
            initialTo={search.to ?? ""}
            initialWhen={search.when ?? ""}
            heading="Your journey"
          />
        </div>
      </div>
    </SiteShell>
  );
}
