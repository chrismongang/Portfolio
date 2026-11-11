import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  copy,
  instagramUrl,
  linkedinUrl,
  servicePath,
  servicePathDe,
  xUrl,
} from "../copy";
import { imprint, imprintPath, privacy, privacyPath } from "../legal";
import { pageForPath } from "../seo";
import { ScrollManager } from "./ScrollManager";

const navItems = [
  {
    to: "/",
    label: copy.home,
    short: undefined,
    isActive: (path: string) => path === "/",
  },
  {
    to: servicePath,
    label: copy.service,
    short: copy.serviceShort,
    isActive: (path: string) =>
      path.startsWith(servicePath) || path.startsWith(servicePathDe),
  },
  {
    to: "/work",
    label: copy.workTitle,
    short: undefined,
    isActive: (path: string) => path.startsWith("/work"),
  },
  {
    to: "/about",
    label: copy.about,
    short: undefined,
    isActive: (path: string) => path.startsWith("/about"),
  },
];

export function Layout() {
  const { pathname } = useLocation();
  const showCall = pathname !== "/contact" && pathname !== "/start";

  useEffect(() => {
    const page = pageForPath(pathname);
    document.title = page.title;
    document.documentElement.lang = page.lang ?? "en";
  }, [pathname]);

  return (
    <div className="flex min-h-svh w-full min-w-0 flex-col bg-white text-ink">
      <div className="mx-0 flex min-h-svh min-w-0 flex-1 flex-col md:mx-[var(--page-gutter)] md:border-x md:border-rail">
        <header className="relative z-20 flex h-[72px] shrink-0 items-center justify-between px-6">
          <Link
            to="/"
            className="text-[17px] font-medium tracking-[-0.02em] md:absolute md:right-full md:top-0 md:flex md:h-full md:w-[var(--page-gutter)] md:items-center md:justify-center md:px-0"
          >
            Chris
          </Link>
          {/* Phones and tablets: the call button sits between the two names. */}
          {showCall ? (
            <Link
              to="/start"
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-4 py-2.5 text-[14px] font-medium leading-none text-ink lg:hidden"
            >
              {copy.startCtaShort}
            </Link>
          ) : null}
          <Link
            to="/"
            className="text-[17px] font-medium tracking-[-0.02em] md:absolute md:left-full md:top-0 md:flex md:h-full md:w-[var(--page-gutter)] md:items-center md:justify-center md:px-0"
          >
            Mongang
          </Link>
        </header>

        {/* Floats at the bottom on phones and tablets, at the top on desktop. */}
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 lg:bottom-auto lg:top-[14px]">
          <nav
            aria-label="Main"
            className="nav-pill flex items-center gap-0.5 rounded-full p-1"
          >
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-medium leading-none transition-colors sm:px-3.5 sm:text-[14px] lg:py-2 ${
                    active
                      ? "nav-pill-active text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.short ? (
                    <>
                      <span className="lg:hidden">{item.short}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </Link>
              );
            })}
          </nav>
          {showCall ? (
            <Link
              to="/start"
              className="hidden whitespace-nowrap rounded-full bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-4 py-3 text-[14px] font-medium leading-none text-ink shadow-[0_6px_24px_rgba(17,17,17,0.06)] hover:from-[#bdecd9] hover:to-[#a6dcf0] lg:block"
            >
              {copy.startCta}
            </Link>
          ) : null}
        </div>

        <span
          className="rail-glow hidden md:block"
          style={{ left: "var(--page-gutter)" }}
          aria-hidden="true"
        />
        <span
          className="rail-glow hidden md:block"
          style={{ right: "var(--page-gutter)" }}
          aria-hidden="true"
        />

        <ScrollManager />
        <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <Outlet />
        </main>

        <footer className="flex flex-wrap justify-center gap-x-6 gap-y-3 overflow-x-hidden px-6 pb-28 pt-8 lg:pb-10">
          <Link
            to={servicePath}
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.service}
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.about}
          </Link>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="me noreferrer"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.linkedin}
          </a>
          <a
            href={xUrl}
            target="_blank"
            rel="me noreferrer"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.x}
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="me noreferrer"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.instagram}
          </a>
          <Link
            to={imprintPath}
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {imprint.title}
          </Link>
          <Link
            to={privacyPath}
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {privacy.title}
          </Link>
        </footer>
      </div>
    </div>
  );
}
