import { allPaths, BUSINESS, staticPages } from "@/lib/content";
import { createFileRoute } from "@tanstack/react-router";

function originOf(request: Request) {
  const configured = process.env.SITE_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originOf(request);
        const urls = allPaths()
          .map((path) => {
            const priority = staticPages.find((p) => p.path === path)?.priority ?? "0.6";
            return `<url><loc>${origin}${path}</loc><lastmod>${BUSINESS.updated}</lastmod><priority>${priority}</priority></url>`;
          })
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
