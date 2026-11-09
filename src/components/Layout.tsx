import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { copy, instagramUrl, linkedinUrl } from "../copy";
import { pageForPath } from "../seo";
import { ScrollManager } from "./ScrollManager";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageForPath(pathname).title;
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
          <Link
            to="/"
            className="text-[17px] font-medium tracking-[-0.02em] md:absolute md:left-full md:top-0 md:flex md:h-full md:w-[var(--page-gutter)] md:items-center md:justify-center md:px-0"
          >
            Mongang
          </Link>
        </header>

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

        <footer className="flex justify-center gap-6 overflow-x-hidden px-6 pb-10 pt-8">
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
            href={instagramUrl}
            target="_blank"
            rel="me noreferrer"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            {copy.instagram}
          </a>
        </footer>
      </div>
    </div>
  );
}
