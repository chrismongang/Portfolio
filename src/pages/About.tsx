import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import { aboutPage, copy, v2vYoutubeUrl } from "../copy";

const { now, v2v, sneakers, boxing } = aboutPage.chapters;

type Photo = { src: string; alt: string; width: number; height: number };

const photos = {
  portrait: {
    src: "/about/chris-mongang-portrait.jpg",
    alt: "Portrait of Chris Mongang",
    width: 1069,
    height: 1600,
  },
  filming: {
    src: "/about/chris-mongang-filming-helicopter.jpg",
    alt: "Chris Mongang filming from a helicopter at the Macher Festival",
    width: 900,
    height: 1600,
  },
  v2v: [
    {
      src: "/about/chris-mongang-v2v-club-host.jpg",
      alt: "Chris Mongang hosting a V2V Club 1v1 tournament",
      width: 1200,
      height: 1600,
    },
    {
      src: "/about/chris-mongang-v2v-club-megaphone.jpg",
      alt: "Chris Mongang moderating a V2V Club event with a megaphone",
      width: 1066,
      height: 1600,
    },
    {
      src: "/about/chris-mongang-v2v-club-crew.jpg",
      alt: "Chris Mongang with the V2V Club camera crew",
      width: 1066,
      height: 1600,
    },
  ],
  sneakers: [
    {
      src: "/about/chris-mongang-ropez4u-black.jpg",
      alt: "Black custom sneakers with oversized laces by Ropez4u, Chris Mongang's sneaker brand",
      width: 1105,
      height: 1600,
    },
    {
      src: "/about/chris-mongang-ropez4u-grey.jpg",
      alt: "Grey custom sneakers with rope laces by Ropez4u, Chris Mongang's sneaker brand",
      width: 1075,
      height: 1600,
    },
  ],
  boxing: [
    {
      src: "/about/chris-mongang-boxing-gloves.jpg",
      alt: "Chris Mongang boxing training",
      width: 1279,
      height: 1600,
    },
    {
      src: "/about/chris-mongang-boxing.jpg",
      alt: "Chris Mongang in the boxing gym",
      width: 1280,
      height: 1600,
    },
  ],
} satisfies Record<string, Photo | Photo[]>;

function Image({ photo, eager }: { photo: Photo; eager?: boolean }) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? "eager" : "lazy"}
      className="aspect-[4/5] w-full bg-placeholder object-cover"
    />
  );
}

function Chapter({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: readonly string[];
}) {
  return (
    <div>
      <p className="text-[14px] text-muted">{label}</p>
      <h2 className="mt-2 text-[24px] font-medium leading-[1.2] tracking-[-0.03em] md:text-[32px]">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-pretty text-[16px] leading-relaxed md:text-[17px]">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <section className="mx-6 pb-20 pt-6 md:mx-10 md:pb-28">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <Image photo={photos.portrait} eager />
          <div>
            <p className="text-[14px] text-muted md:text-[15px]">
              {aboutPage.eyebrow}
            </p>
            <h1 className="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.04em] md:text-[48px]">
              {aboutPage.title}
            </h1>
            <div className="mt-6 space-y-5 text-pretty text-[16px] leading-relaxed md:text-[17px]">
              {aboutPage.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 text-[14px] text-muted">{aboutPage.location}</p>
          </div>
        </div>
      </section>

      <Section wide>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="md:order-2">
            <Image photo={photos.filming} />
          </div>
          <Chapter {...now} />
        </div>
      </Section>

      <Section wide>
        <div className="max-w-2xl">
          <Chapter {...v2v} />
          <ul className="mt-8 flex flex-wrap gap-2">
            {v2v.facts.map((fact) => (
              <li key={fact.text}>
                {"href" in fact ? (
                  <a
                    href={fact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl bg-button px-3 py-1.5 text-[14px] underline underline-offset-[3px] hover:bg-[#e8e8e8]"
                  >
                    {fact.text} ↗
                  </a>
                ) : (
                  <span className="block rounded-xl bg-button px-3 py-1.5 text-[14px]">
                    {fact.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <a
            href={v2vYoutubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block text-[15px] font-medium underline underline-offset-[3px] hover:text-muted"
          >
            {v2v.youtube} ↗
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {photos.v2v.map((photo) => (
            <Image key={photo.src} photo={photo} />
          ))}
        </div>
      </Section>

      <Section wide>
        <div className="max-w-2xl">
          <Chapter {...sneakers} />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {photos.sneakers.map((photo) => (
            <Image key={photo.src} photo={photo} />
          ))}
        </div>
      </Section>

      <Section wide>
        <div className="max-w-2xl">
          <Chapter {...boxing} />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {photos.boxing.map((photo) => (
            <Image key={photo.src} photo={photo} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
            {aboutPage.closing}
          </h2>
          <Link
            to="/contact"
            className="mt-10 rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0]"
          >
            {copy.bookCall}
          </Link>
        </div>
      </Section>
    </div>
  );
}
