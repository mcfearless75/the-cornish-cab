import { BUSINESS, faqs, places, services } from "@/lib/content";

type MatchLike = { routeId: string; loaderData?: unknown };

export function originFromMatches(matches: readonly MatchLike[]): string {
  const root = matches.find((m) => m.routeId === "__root__");
  return typeof root?.loaderData === "string" ? root.loaderData : "";
}

function businessNode(origin: string) {
  const node: Record<string, unknown> = {
    "@type": "TaxiService",
    name: BUSINESS.name,
    telephone: BUSINESS.phoneTel,
    description: BUSINESS.description,
    slogan: "One driver. One vehicle.",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: "GB",
    },
    areaServed: [
      { "@type": "City", name: "St Austell" },
      { "@type": "AdministrativeArea", name: "Cornwall" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Taxi services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
        },
      })),
    },
  };
  if (origin) {
    node["@id"] = `${origin}/#business`;
    node.url = origin;
    node.image = `${origin}/media/charlestown.jpg`;
  }
  return node;
}

export function taxiGraph(origin: string) {
  return {
    "@context": "https://schema.org",
    ...businessNode(origin),
  };
}

export function breadcrumb(origin: string, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(origin ? { item: `${origin}${c.path}` } : {}),
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function placeSchema(origin: string, slug: string) {
  const place = places.find((p) => p.slug === slug);
  if (!place) return taxiGraph(origin);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Taxi — ${place.name}`,
    serviceType: "TaxiService",
    description: place.lede + " " + place.body,
    provider: businessNode(origin),
    areaServed: {
      "@type": "Place",
      name: `${place.name}, Cornwall, United Kingdom`,
    },
  };
}

export function seoHead(args: {
  title: string;
  description: string;
  path: string;
  origin: string;
  schemas?: Record<string, unknown>[];
}) {
  const url = args.origin ? `${args.origin}${args.path}` : "";
  return {
    meta: [
      { title: args.title },
      { name: "description", content: args.description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: BUSINESS.name },
      { name: "geo.region", content: "GB-CON" },
      { name: "geo.placename", content: "St Austell, Cornwall, United Kingdom" },
      { name: "geo.position", content: "50.338;-4.789" },
      { name: "ICBM", content: "50.338, -4.789" },
    ],
    links: url ? [{ rel: "canonical", href: url }] : [],
    scripts: (args.schemas ?? []).map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  };
}
