import { logos } from "../data/logos";

export function LogoSlider() {
  const track = [...logos, ...logos];

  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent md:w-16"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent md:w-16"
        aria-hidden="true"
      />
      <div className="logo-track flex w-max items-center gap-10 py-2 md:gap-14">
        {track.map((logo, index) => (
          <img
            key={`${logo.name}-${index}`}
            src={logo.src}
            alt={index < logos.length ? logo.name : ""}
            aria-hidden={index >= logos.length}
            className="h-8 w-auto max-w-[132px] object-contain object-center md:h-10 md:max-w-[148px]"
          />
        ))}
      </div>
    </div>
  );
}
