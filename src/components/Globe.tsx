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
  Position,
} from "geojson";
import { useEffect, useRef } from "react";
import type { ServiceContent } from "../copy";
import {
  dachCountries,
  europeCountries,
  europeCountryNames,
  places,
} from "../data/places";

type Country = Feature<Polygon | MultiPolygon, { name: string }>;
type Shade = "dach" | "europe" | undefined;
type Box = { x: number; y: number; w: number; h: number };

// The two colours of the rail light and the "Book a call" button.
const mint = "#c9f4e6";
const sky = "#b7e4f6";
const ink = "#111111";

const font = '"Satoshi", Helvetica, Arial, sans-serif';
const minZoom = 1;
const maxZoom = 5;

const shortNames: Record<string, string> = {
  "United States of America": "United States",
  "Bosnia and Herz.": "Bosnia",
  "Dem. Rep. Congo": "DR Congo",
  "Central African Rep.": "C. African Rep.",
};

/** Countries with far-away territories are labelled and shaded on their main land only. */
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
  if (dachCountries.has(id)) return "dach";
  if (europeCountries.has(id)) return "europe";
  if (europeCountryNames.has(country.properties.name)) return "europe";
  return undefined;
}

function overlaps(a: Box, b: Box) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

/** A white globe that shows where Chris is based, has filmed and is available. Drag to turn it. */
export function Globe({ labels }: { labels: ServiceContent["where"]["globe"] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef<(factor: number) => void>(() => {});

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrap || !canvas || !context) return;

    let countries: { country: Country; main: Country; shade: Shade }[] = [];
    let cancelled = false;
    // Longitude and latitude at the centre of the view.
    let centre: [number, number] = [wrap.clientWidth < 640 ? 4 : -25, 11];
    let zoom = 1;
    let frame = 0;

    const projection = geoOrthographic().clipAngle(90).precision(0.3);
    const path = geoPath(projection, context);

    function draw() {
      frame = 0;
      if (!wrap || !canvas || !context) return;
      const width = wrap.clientWidth;
      const height = Math.round(Math.min(Math.max(width * 0.62, 320), 560));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.height = `${height}px`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      // Only the upper part of the globe is in view. Zooming grows it
      // around the middle of the picture.
      const baseRadius = Math.max(width * 0.72, 300);
      const radius = baseRadius * zoom;
      const focusY = height / 2;
      const centreX = width / 2;
      const centreY = focusY + (baseRadius + 28 - focusY) * zoom;
      projection
        .scale(radius)
        .translate([centreX, centreY])
        .rotate([-centre[0], -centre[1]]);

      // The sphere, with a soft glow in the brand colour.
      context.save();
      context.shadowColor = "rgba(183, 228, 246, 0.55)";
      context.shadowBlur = 48;
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
      for (const { country } of countries) path(country);
      context.fillStyle = "#f5f5f5";
      context.fill();
      context.strokeStyle = "#d6d6d6";
      context.lineWidth = 0.75;
      context.stroke();

      for (const tone of ["europe", "dach"] as const) {
        context.beginPath();
        for (const { main, shade } of countries) {
          if (shade === tone) path(main);
        }
        context.fillStyle =
          tone === "dach" ? "rgba(183, 228, 246, 0.95)" : "rgba(201, 244, 230, 0.6)";
        context.fill();
        context.strokeStyle = tone === "dach" ? "#8fc9e0" : "#b4d9cd";
        context.lineWidth = 0.75;
        context.stroke();
      }

      context.beginPath();
      path({ type: "Sphere" });
      context.strokeStyle = "#e2e2e2";
      context.lineWidth = 1;
      context.stroke();

      const visible = (point: Position) =>
        geoDistance(point as [number, number], centre) < Math.PI / 2 - 0.05;

      // Places first, so their labels win over country names.
      const taken: Box[] = [];
      const spots = places.flatMap((place) => {
        const point: [number, number] = [place.lon, place.lat];
        const projected = visible(point) ? projection(point) : null;
        return projected ? [{ place, x: projected[0], y: projected[1] }] : [];
      });

      for (const { place, x, y } of spots) {
        if (!place.available) continue;
        context.beginPath();
        context.arc(x, y, 18, 0, Math.PI * 2);
        context.fillStyle = "rgba(201, 244, 230, 0.6)";
        context.fill();
        context.strokeStyle = "#b4d9cd";
        context.lineWidth = 0.75;
        context.stroke();
      }

      // Drawn back to front, so the base stays on top of nearby places.
      for (const { place, x, y } of [...spots].reverse()) {
        const size = place.base ? 7 : 4.5;
        const fill = context.createLinearGradient(x - size, y, x + size, y);
        fill.addColorStop(0, mint);
        fill.addColorStop(1, sky);
        context.save();
        context.shadowColor = "rgba(120, 200, 225, 0.9)";
        context.shadowBlur = place.base ? 16 : 10;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = fill;
        context.fill();
        context.restore();
        context.strokeStyle = ink;
        context.lineWidth = 1.25;
        context.stroke();
        if (place.base) {
          context.beginPath();
          context.arc(x, y, 2.25, 0, Math.PI * 2);
          context.fillStyle = ink;
          context.fill();
        }
        taken.push({ x: x - size - 2, y: y - size - 2, w: size * 2 + 4, h: size * 2 + 4 });
      }

      context.font = `500 12px ${font}`;
      context.textBaseline = "middle";
      context.lineJoin = "round";
      for (const { place, x, y } of spots) {
        const textWidth = context.measureText(place.name).width;
        const gap = place.base ? 12 : 9;
        const options: Box[] = [
          { x: x + gap, y: y - 8, w: textWidth, h: 16 },
          { x: x - gap - textWidth, y: y - 8, w: textWidth, h: 16 },
          { x: x - textWidth / 2, y: y - gap - 16, w: textWidth, h: 16 },
          { x: x - textWidth / 2, y: y + gap, w: textWidth, h: 16 },
        ];
        const box = options.find(
          (option) => !taken.some((other) => overlaps(option, other)),
        );
        if (!box) continue;
        taken.push(box);
        context.textAlign = "left";
        context.strokeStyle = "rgba(255, 255, 255, 0.92)";
        context.lineWidth = 3.5;
        context.strokeText(place.name, box.x, box.y + 8);
        context.fillStyle = ink;
        context.fillText(place.name, box.x, box.y + 8);
      }

      // Country names, where the country is large enough on screen.
      context.font = `500 10.5px ${font}`;
      context.textAlign = "center";
      for (const { main, shade } of countries) {
        const point = geoCentroid(main);
        if (!visible(point)) continue;
        const projected = projection(point);
        if (!projected) continue;
        const [[left, top], [right, bottom]] = path.bounds(main);
        const name = shortNames[main.properties.name] ?? main.properties.name;
        const textWidth = context.measureText(name).width;
        if (right - left < textWidth * 1.15 || bottom - top < 16) continue;
        const box = {
          x: projected[0] - textWidth / 2 - 2,
          y: projected[1] - 8,
          w: textWidth + 4,
          h: 16,
        };
        if (taken.some((other) => overlaps(box, other))) continue;
        taken.push(box);
        context.fillStyle = shade ? "#5f7f86" : "#a6a6a6";
        context.fillText(name, projected[0], projected[1]);
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    // Dragging turns the globe.
    let dragging: { x: number; y: number } | null = null;
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
          -15,
          Math.min(60, centre[1] + (event.clientY - dragging.y) * degreesPerPixel),
        ),
      ];
      dragging = { x: event.clientX, y: event.clientY };
      schedule();
    }
    function onPointerUp() {
      dragging = null;
      canvas!.style.cursor = "grab";
    }

    zoomRef.current = (factor) => {
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom * factor));
      schedule();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    const observer = new ResizeObserver(schedule);
    observer.observe(wrap);
    void document.fonts?.ready.then(schedule);

    // The map data is loaded only when the globe is on the page.
    void Promise.all([
      import("topojson-client"),
      import("world-atlas/countries-110m.json"),
    ]).then(([topojson, atlas]) => {
      if (cancelled) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topology = atlas.default as any;
      const world = topojson.feature(
        topology,
        topology.objects.countries,
      ) as unknown as FeatureCollection<Polygon | MultiPolygon, { name: string }>;
      countries = world.features
        .filter((country) => country.properties.name !== "Antarctica")
        .map((country) => ({
          country,
          main: mainland(country),
          shade: shadeOf(country),
        }));
      schedule();
    });

    schedule();
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const zoomButton =
    "flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-[18px] leading-none text-ink shadow-[0_4px_16px_rgba(17,17,17,0.06)] backdrop-blur hover:bg-white";

  return (
    <figure className="mt-12">
      <div ref={wrapRef} className="relative w-full select-none">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={labels.label}
          className="block h-[320px] w-full cursor-grab touch-pan-y md:h-[560px]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
          aria-hidden="true"
        />
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            aria-label={labels.zoomIn}
            className={zoomButton}
            onClick={() => zoomRef.current(1.5)}
          >
            +
          </button>
          <button
            type="button"
            aria-label={labels.zoomOut}
            className={zoomButton}
            onClick={() => zoomRef.current(1 / 1.5)}
          >
            −
          </button>
        </div>
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
            <span className="block h-2.5 w-2.5 rounded-full border-[1.25px] border-ink bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]" />
            {labels.filmed}
          </li>
          <li className="flex items-center gap-2">
            <span className="block h-3 w-5 rounded-[4px] border border-[#8fc9e0] bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]" />
            {labels.available}
          </li>
        </ul>
        <p className="mt-4 text-[14px] text-muted">{labels.filmedIn}</p>
        <p className="mt-1 text-[13px] text-muted/70">{labels.hint}</p>
      </figcaption>
    </figure>
  );
}
