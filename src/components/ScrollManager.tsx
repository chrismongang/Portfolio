import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map<string, number>();
let savedPortfolioScroll: number | null = null;
let openedCaseFromPortfolio = false;

export function rememberPortfolioScroll() {
  savedPortfolioScroll = Math.max(0, window.scrollY);
  openedCaseFromPortfolio = true;
}

function isCaseStudyPath(path: string) {
  return /^\/work\/[^/]+$/.test(path);
}

function scrollToY(y: number) {
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function pinScroll(y: number) {
  let stop = false;
  let applying = false;

  const apply = () => {
    if (stop || applying) return;
    applying = true;
    scrollToY(y);
    applying = false;
  };

  const onScroll = () => {
    if (stop || applying || Math.abs(window.scrollY - y) <= 1) return;
    apply();
  };

  apply();
  const frame = requestAnimationFrame(apply);
  const soon = window.setTimeout(apply, 0);
  const mid = window.setTimeout(apply, 50);
  const late = window.setTimeout(apply, 150);
  window.addEventListener("scroll", onScroll, { passive: true });
  const release = window.setTimeout(() => {
    stop = true;
    window.removeEventListener("scroll", onScroll);
  }, 350);

  return () => {
    stop = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(soon);
    window.clearTimeout(mid);
    window.clearTimeout(late);
    window.clearTimeout(release);
    window.removeEventListener("scroll", onScroll);
  };
}

export function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previous = useRef<{ key: string; path: string } | null>(null);
  const handledKey = useRef<string | null>(null);
  const target = useRef(0);

  if (history.scrollRestoration !== "manual") {
    history.scrollRestoration = "manual";
  }

  useLayoutEffect(() => {
    if (handledKey.current === location.key) {
      return pinScroll(target.current);
    }

    const prior = previous.current;
    if (prior && prior.key !== location.key) {
      positions.set(prior.key, Math.max(0, window.scrollY));
    }

    const path = location.pathname;
    let y = 0;

    if (isCaseStudyPath(path)) {
      const freshEntry =
        prior === null ||
        (navigationType !== "POP" && !openedCaseFromPortfolio);
      if (freshEntry) savedPortfolioScroll = null;
      openedCaseFromPortfolio = false;
    } else if (
      path === "/work" &&
      prior &&
      isCaseStudyPath(prior.path) &&
      savedPortfolioScroll !== null
    ) {
      y = savedPortfolioScroll;
    } else if (navigationType === "POP") {
      y = positions.get(location.key) ?? 0;
    }

    previous.current = { key: location.key, path };
    handledKey.current = location.key;
    target.current = y;
    return pinScroll(y);
  }, [location.key, location.pathname, navigationType]);

  return null;
}
