import { useLayoutEffect, useRef, useState } from "react";
import { logos } from "../data/logos";

const LOOP_MS = 36_000;

export function LogoSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(2);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const set = setRef.current;
    if (!viewport || !track || !set) return;

    let animation: Animation | undefined;
    let shift = 0;

    const measure = () => {
      const setWidth = set.getBoundingClientRect().width;
      const viewWidth = viewport.clientWidth;
      if (setWidth <= 0 || viewWidth <= 0) return;

      const nextRepeat = Math.max(2, Math.ceil(viewWidth / setWidth) + 1);
      setRepeat((current) => (current === nextRepeat ? current : nextRepeat));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation?.cancel();
        animation = undefined;
        track.style.transform = "";
        return;
      }

      if (animation && Math.abs(shift - setWidth) < 0.5) return;

      shift = setWidth;
      animation?.cancel();
      animation = track.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(${-setWidth}px, 0, 0)` },
        ],
        { duration: LOOP_MS, iterations: Infinity, easing: "linear" },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(set);
    const images = Array.from(set.querySelectorAll("img"));
    for (const image of images) image.addEventListener("load", measure);

    return () => {
      animation?.cancel();
      observer.disconnect();
      for (const image of images) image.removeEventListener("load", measure);
    };
  }, [repeat]);

  return (
    <div ref={viewportRef} className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent md:w-16"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent md:w-16"
        aria-hidden="true"
      />
      <div ref={trackRef} className="logo-track flex w-max items-center py-2">
        {Array.from({ length: repeat }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14"
            aria-hidden={copy > 0}
          >
            {logos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={copy === 0 ? logo.name : ""}
                className="h-8 w-auto max-w-[132px] shrink-0 object-contain object-center md:h-10 md:max-w-[148px]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
