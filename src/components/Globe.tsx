import {
  geoArea,
  geoCentroid,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";
import { useEffect, useRef } from "react";
import type { ServiceContent } from "../copy";
import {
  availableCountries,
  availableCountryNames,
  homeCountries,
  mainlandOnly,
  places,
} from "../data/places";

type Country = Feature<Polygon | MultiPolygon, { name: string }>;
type Shade = "home" | "available" | undefined;
type Box = { x: number; y: number; w: number; h: number };
type Land = {
  country: Country;
  /** What gets filled when the country is shaded. */
  fill: Country;
  shade: Shade;
  name: string;
  /** Where the name goes: the middle of the largest piece of land. */
  middle: [number, number];
  /** Rough width of that piece, as an angle seen from the globe's centre. */
  span: number;
};

// The two colours of the rail light and the "Book a call" button.
const mint = "#c9f4e6";
const sky = "#b7e4f6";
const ink = "#111111";

const font = '"Satoshi", Helvetica, Arial, sans-serif';

/** Degrees per second while nobody is touching the globe. */
const turnSpeed = 4;
/** How long the globe waits after a drag before it turns again. */
const restAfterDrag = 2500;

const shortNames: Record<string, string> = {
  "United States of America": "United States",
  "Bosnia and Herz.": "Bosnia",
  "Dem. Rep. Congo": "DR Congo",
  "Central African Rep.": "C. African Rep.",
};

/** The largest connected piece of a country, without far-away territories. */
function mainland(country: Country): Country {
  if (country.geometry.type === "Polygon") return country;
  const polygons = country.geometry.coordinates;
  let largest = polygons[0];
  let largestArea = 0;
  for (const coordinates of polygons) {
    const area = geoArea({ type: "Polygon", coordinates });
    if (area > largestArea) {
      largest = coordinates;
      largestArea = area;
    }
  }
  return {
    ...country,
    geometry: { type: "Polygon", coordinates: largest },
  };
}

function shadeOf(country: Country): Shade {
  const id = String(country.id ?? "");
  if (homeCountries.has(id)) return "home";
  if (availableCountries.has(id)) return "available";
  if (availableCountryNames.has(country.properties.name)) return "available";
  return undefined;
}

function overlaps(a: Box, b: Box) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

/**
 * A white globe that shows where Chris is based, has filmed and is
 * available. It turns slowly on its own and can be dragged.
 */
export function Globe({
  labels,
  lang,
}: {
  labels: ServiceContent["where"]["globe"];
  lang: "en" | "de";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const placeName = (place: (typeof places)[number]) =>
    lang === "de" ? (place.nameDe ?? place.name) : place.name;
  const filmedIn = new Intl.ListFormat(lang, { type: "conjunction" }).format(
    places.map(placeName),
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrap || !canvas || !context) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lands: Land[] = [];
    let cancelled = false;
    // Longitude and latitude at the centre of the view.
    let centre: [number, number] = [-22, 22];
    let frame = 0;
    let lastTime = 0;
    let restUntil = 0;
    let onScreen = false;
    let needsDraw = true;
    let dragging: { x: number; y: number } | null = null;

    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(projection, context);

    function draw() {
      if (!wrap || !canvas || !context) return;
      const width = wrap.clientWidth;
      // The whole width of the globe is in view; its lower part fades out.
      const radius = Math.min(width / 2 - 10, 440);
      const top = 20;
      const height = Math.round(top + radius * 0.96);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.height = `${height}px`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const centreX = width / 2;
      const centreY = top + radius;
      projection
        .scale(radius)
        .translate([centreX, centreY])
        .rotate([-centre[0], -centre[1]]);

      // The sphere, with a soft glow in the brand colour.
      context.save();
      context.shadowColor = "rgba(183, 228, 246, 0.6)";
      context.shadowBlur = 28;
      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = "#ffffff";
      context.fill();
      context.restore();

      const shading = context.createRadialGradient(
        centreX,
        centreY,
        radius * 0.55,
        centreX,
        centreY,
        radius,
      );
      shading.addColorStop(0, "rgba(17, 17, 17, 0)");
      shading.addColorStop(1, "rgba(17, 17, 17, 0.045)");
      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = shading;
      context.fill();

      context.beginPath();
      path(geoGraticule10());
      context.strokeStyle = "#f1f1f1";
      context.lineWidth = 1;
      context.stroke();

      // Land, then the shaded countries on top.
      context.beginPath();
      for (const { country } of lands) path(country);
      context.fillStyle = "#f5f5f5";
      context.fill();
      context.strokeStyle = "#d6d6d6";
      context.lineWidth = 0.75;
      context.stroke();

      for (const tone of ["available", "home"] as const) {
        context.beginPath();
        for (const { fill, shade } of lands) {
          if (shade === tone) path(fill);
        }
        context.fillStyle =
          tone === "home"
            ? "rgba(183, 228, 246, 0.95)"
            : "rgba(201, 244, 230, 0.75)";
        context.fill();
        context.strokeStyle = tone === "home" ? "#8fc9e0" : "#b4d9cd";
        context.lineWidth = 0.75;
        context.stroke();
      }

      context.beginPath();
      path({ type: "Sphere" });
      context.strokeStyle = "#e2e2e2";
      context.lineWidth = 1;
      context.stroke();

      const visible = (point: [number, number]) =>
        geoDistance(point, centre) < Math.PI / 2 - 0.06;

      // Places first, so their names win over country names.
      const taken: Box[] = [];
      const baseSize = Math.max(3.5, Math.min(7, radius / 60));
      const dotSize = Math.max(2, Math.min(4.5, radius / 95));
      const spots = places.flatMap((place) => {
        const point: [number, number] = [place.lon, place.lat];
        const projected = visible(point) ? projection(point) : null;
        return projected ? [{ place, x: projected[0], y: projected[1] }] : [];
      });

      // Drawn back to front, so the base stays on top of nearby places.
      for (const { place, x, y } of [...spots].reverse()) {
        const size = place.base ? baseSize : dotSize;
        const fill = context.createLinearGradient(x - size, y, x + size, y);
        fill.addColorStop(0, mint);
        fill.addColorStop(1, sky);
        context.save();
        context.shadowColor = "rgba(120, 200, 225, 0.9)";
        context.shadowBlur = place.base ? 16 : 8;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = fill;
        context.fill();
        context.restore();
        context.strokeStyle = ink;
        context.lineWidth = place.base ? 1.25 : 1;
        context.stroke();
        if (place.base) {
          context.beginPath();
          context.arc(x, y, size / 3, 0, Math.PI * 2);
          context.fillStyle = ink;
          context.fill();
        }
        taken.push({
          x: x - size - 1.5,
          y: y - size - 1.5,
          w: size * 2 + 3,
          h: size * 2 + 3,
        });
      }

      context.font = `500 12px ${font}`;
      context.textBaseline = "middle";
      context.textAlign = "left";
      context.lineJoin = "round";
      for (const { place, x, y } of spots) {
        const name = placeName(place);
        const textWidth = context.measureText(name).width;
        const gap = (place.base ? baseSize : dotSize) + 5;
        const options: Box[] = [
          { x: x + gap, y: y - 7, w: textWidth, h: 14 },
          { x: x - gap - textWidth, y: y - 7, w: textWidth, h: 14 },
          { x: x - textWidth / 2, y: y - gap - 14, w: textWidth, h: 14 },
          { x: x - textWidth / 2, y: y + gap, w: textWidth, h: 14 },
        ];
        const box = options.find(
          (option) => !taken.some((other) => overlaps(option, other)),
        );
        if (!box) continue;
        taken.push(box);
        context.strokeStyle = "rgba(255, 255, 255, 0.92)";
        context.lineWidth = 3.5;
        context.strokeText(name, box.x, box.y + 7);
        context.fillStyle = ink;
        context.fillText(name, box.x, box.y + 7);
      }

      // Country names, where the country is large enough on screen.
      context.font = `500 10.5px ${font}`;
      context.textAlign = "center";
      for (const land of lands) {
        if (!visible(land.middle)) continue;
        const textWidth = context.measureText(land.name).width;
        if (land.span * radius < textWidth * 1.2) continue;
        const projected = projection(land.middle);
        if (!projected) continue;
        const box = {
          x: projected[0] - textWidth / 2 - 2,
          y: projected[1] - 8,
          w: textWidth + 4,
          h: 16,
        };
        if (taken.some((other) => overlaps(box, other))) continue;
        taken.push(box);
        context.fillStyle = land.shade ? "#5f7f86" : "#a6a6a6";
        context.fillText(land.name, projected[0], projected[1]);
      }
    }

    function tick(time: number) {
      frame = 0;
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      const turning = !still && !dragging && time >= restUntil;
      if (turning) {
        // Eastwards, like the Earth.
        centre = [centre[0] - seconds * turnSpeed, centre[1]];
        needsDraw = true;
      }
      if (needsDraw) {
        needsDraw = false;
        draw();
      }
      if (onScreen) frame = requestAnimationFrame(tick);
    }

    function wake() {
      needsDraw = true;
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    // Dragging turns the globe.
    function onPointerDown(event: PointerEvent) {
      dragging = { x: event.clientX, y: event.clientY };
      canvas!.setPointerCapture(event.pointerId);
      canvas!.style.cursor = "grabbing";
    }
    function onPointerMove(event: PointerEvent) {
      if (!dragging) return;
      const degreesPerPixel = 180 / (Math.PI * projection.scale());
      centre = [
        centre[0] - (event.clientX - dragging.x) * degreesPerPixel,
        Math.max(
          0,
          Math.min(50, centre[1] + (event.clientY - dragging.y) * degreesPerPixel),
        ),
      ];
      dragging = { x: event.clientX, y: event.clientY };
      wake();
    }
    function onPointerUp() {
      dragging = null;
      restUntil = performance.now() + restAfterDrag;
      canvas!.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    const resize = new ResizeObserver(wake);
    resize.observe(wrap);
    // The globe only turns while it is on screen.
    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
    });
    watcher.observe(wrap);
    void document.fonts?.ready.then(wake);

    // The map data is loaded only when the globe is on the page.
    void Promise.all([
      import("topojson-client"),
      import("world-atlas/countries-110m.json"),
    ]).then(([topojson, atlas]) => {
      if (cancelled) return;
      const topology = atlas.default as unknown as Parameters<
        typeof topojson.feature
      >[0];
      const world = topojson.feature(
        topology,
        topology.objects.countries,
      ) as unknown as FeatureCollection<Polygon | MultiPolygon, { name: string }>;
      lands = world.features
        .filter((country) => country.properties.name !== "Antarctica")
        .map((country) => {
          const main = mainland(country);
          return {
            country,
            fill: mainlandOnly.has(String(country.id ?? "")) ? main : country,
            shade: shadeOf(country),
            name: shortNames[country.properties.name] ?? country.properties.name,
            middle: geoCentroid(main),
            span: Math.sqrt(geoArea(main)),
          };
        });
      wake();
    });

    wake();
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      watcher.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
    // The names on the globe follow the page language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <figure className="mx-auto mt-12 max-w-[900px]">
      <div ref={wrapRef} className="relative w-full select-none">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={labels.label}
          className="block aspect-[2/1] w-full cursor-grab touch-pan-y"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white"
          aria-hidden="true"
        />
      </div>
      <figcaption className="mt-6 text-center">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
          <li className="flex items-center gap-2">
            <span className="relative block h-3.5 w-3.5 rounded-full border-[1.25px] border-ink bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]">
              <span className="absolute left-1/2 top-1/2 block h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
            </span>
            {labels.base}
          </li>
          <li className="flex items-center gap-2">
            <span className="block h-2.5 w-2.5 rounded-full border border-ink bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]" />
            {labels.filmed}
          </li>
          <li className="flex items-center gap-2">
            <span className="block h-3 w-5 rounded-[4px] border border-[#b4d9cd] bg-[#c9f4e6]" />
            {labels.available}
          </li>
        </ul>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-[14px] leading-relaxed text-muted">
          {labels.filmedIn} {filmedIn}.
        </p>
        <p className="mt-1 text-[13px] text-muted/70">{labels.hint}</p>
      </figcaption>
    </figure>
  );
}
