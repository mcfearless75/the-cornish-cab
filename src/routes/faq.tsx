import { AskPanel } from "@/components/ask-panel";
import { SiteShell } from "@/components/site-shell";
import { faqs } from "@/lib/content";
import { breadcrumb, faqSchema, originFromMatches, seoHead, taxiGraph } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seoHead({
      title: "Taxi FAQ | The Cornish Cab, St Austell",
      description:
        "How booking, fares, school-run hours and passenger limits work at The Cornish Cab. St Austell taxi, phone 07708 067775.",
      path: "/faq",
      origin,
      schemas: [
        taxiGraph(origin),
        faqSchema(),
        breadcrumb(origin, [
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]),
      ],
    });
  },
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium text-clay">Questions</p>
        <h1 className="mt-2 max-w-3xl text-5xl text-ink">Straight answers, same words every time.</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">
          These are the facts the assistant is allowed to repeat. If a question is not here, the honest
          answer is to call 07708 067775 rather than guess.
        </p>
        <div className="mt-8 grid max-w-3xl gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-2xl border border-line bg-card px-5 py-4">
              <summary className="cursor-pointer text-lg font-medium text-ink">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-mist">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12">
          <AskPanel />
        </div>
      </article>
    </SiteShell>
  );
}
