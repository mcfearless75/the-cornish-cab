import { createFileRoute } from "@tanstack/react-router";

function originOf(request: Request) {
  const configured = process.env.SITE_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

const bots = ["*", "GPTBot", "ChatGPT-User", "OAI-SearchBot", "Google-Extended", "Googlebot", "Bingbot", "PerplexityBot", "ClaudeBot", "Applebot-Extended", "Amazonbot"];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originOf(request);
        const body = [
          ...bots.map((bot) => `User-agent: ${bot}\nAllow: /\n`),
          `Sitemap: ${origin}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
