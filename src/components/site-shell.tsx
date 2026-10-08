import { BUSINESS, whatsappHref } from "@/lib/content";
import { publicUrl } from "@/lib/public-url";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/book", label: "Book" },
  { to: "/services", label: "Services" },
  { to: "/areas", label: "Areas" },
  { to: "/airport-transfers", label: "Airports" },
  { to: "/train-stations", label: "Stations" },
  { to: "/faq", label: "FAQ" },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/areas") return pathname === "/areas" || pathname.startsWith("/areas/");
  return pathname === to;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-pine focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="h-1 bg-gold" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-harbour text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="min-w-0">
            <span className="block font-display text-xl leading-none">The Cornish Cab</span>
            <span className="mt-1 block text-xs tracking-wide text-gold">St Austell · Cornwall</span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "text-sm font-medium " +
                  (isActive(pathname, item.to) ? "text-gold" : "text-cream hover:text-gold")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={whatsappHref("Hello, I would like to book The Cornish Cab.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full bg-gold px-4 text-sm font-semibold text-harbour"
            >
              WhatsApp
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-cream lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
        {open ? (
          <nav id="mobile-nav" className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex h-11 items-center text-base font-medium text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="flex h-11 items-center text-base font-medium text-cream">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
      <main id="content">{children}</main>
      <footer className="mt-20 border-t border-white/10 bg-harbour text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">The Cornish Cab</p>
            <address className="mt-3 text-sm not-italic leading-relaxed text-cream/80">
              Independent taxi
              <br />
              St Austell, Cornwall
              <br />
              <a className="text-cream underline decoration-clay underline-offset-4" href={whatsappHref()}>
                WhatsApp {BUSINESS.phoneDisplay}
              </a>
            </address>
          </div>
          <div>
            <p className="text-sm font-medium text-cream/70">On this site</p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li><Link to="/book" className="hover:underline">Get a road route and request a booking</Link></li>
              <li><Link to="/airport-transfers" className="hover:underline">Airport transfers</Link></li>
              <li><Link to="/train-stations" className="hover:underline">Train stations</Link></li>
              <li><Link to="/faq" className="hover:underline">Questions, answered plainly</Link></li>
              <li><Link to="/about" className="hover:underline">One driver, one vehicle</Link></li>
            </ul>
          </div>
          <div className="text-sm leading-relaxed text-cream/80">
            <p>
              Maximum three passengers. Bookings outside school-run times. A job is not confirmed until
              availability is checked. The fare follows the live road route.
            </p>
            <p className="mt-4">
              <a className="underline decoration-clay underline-offset-4" href={publicUrl("llms.txt")}>
                Facts for search and AI assistants
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
