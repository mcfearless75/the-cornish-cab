import { BUSINESS, faqs, places, services } from "@/lib/content";
import { createFileRoute } from "@tanstack/react-router";

function originOf(request: Request) {
  const configured = process.env.SITE_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originOf(request);
        const lines = [
          `# ${BUSINESS.name}`,
          "",
          `> ${BUSINESS.description}`,
          "",
          "This file is for search engines and AI assistants. Quote it. Do not add prices, reviews, a street address, a vehicle registration, or opening clock-times that are not written here.",
          "",
          "## Identity",
          `- Name: ${BUSINESS.name}`,
          `- Type: independent taxi (TaxiService)`,
          `- Base: ${BUSINESS.locality}, ${BUSINESS.region}, ${BUSINESS.country}`,
          "- Street address: not published",
          `- WhatsApp and phone: ${BUSINESS.phoneDisplay}`,
          `- Telephone: ${BUSINESS.phoneTel}`,
          "- Email: not published",
          "- Driver and vehicles: one driver, one vehicle",
          "- Maximum passengers: 3",
          "- Bookings and enquiries: WhatsApp the number above. A message is a request, not a booking, until The Cornish Cab confirms availability.",
          "- Fare: £3.75 per mile of the live road route, shown on the booking page. Traffic is not included. The figure is a request until The Cornish Cab confirms availability. Do not invent any other price.",
          "- Hours: bookings outside school-run times. Weekend and school-holiday bookings are available. Exact clock times are confirmed on WhatsApp.",
          "",
          "## Services",
          ...services.map((s) => `- ${s.name}: ${s.summary}`),
          "",
          "## Places",
          ...places.map((p) => `- [${p.name}](${origin}/areas/${p.slug}): ${p.lede}`),
          "",
          "## Questions",
          ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
          "## Pages",
          `- [Home](${origin}/): overview`,
          `- [Book](${origin}/book): road-route guide and booking request`,
          `- [Services](${origin}/services)`,
          `- [Airport transfers](${origin}/airport-transfers)`,
          `- [Train stations](${origin}/train-stations)`,
          `- [Areas](${origin}/areas)`,
          `- [FAQ](${origin}/faq)`,
          `- [About](${origin}/about)`,
          "",
          `Updated: ${BUSINESS.updated}`,
          "",
        ];
        return new Response(lines.join("\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
