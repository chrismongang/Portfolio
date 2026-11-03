import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MuxEmbed } from "../components/MuxEmbed";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { caseStudyCopy, copy } from "../copy";
import { projects } from "../data/projects";

const unicornBakeryName = "Unicorn Bakery";
const unicornBakeryUrl = "https://unicornbakery.de/de";
function paragraphWithLinks(paragraph: string) {
  const inlineLink = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  const withBakery = paragraph.replaceAll(
    unicornBakeryName,
    `[${unicornBakeryName}](${unicornBakeryUrl})`,
  );
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of withBakery.matchAll(inlineLink)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(withBakery.slice(lastIndex, index));
    nodes.push(
      <a
        key={`${match[2]}-${index}`}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-[3px]"
      >
        {match[1]}
      </a>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < withBakery.length) nodes.push(withBakery.slice(lastIndex));
  return nodes;
}

export function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((item) => item.caseStudy?.slug === slug);

  if (!project?.caseStudy) {
    return <Navigate to="/work" replace />;
  }

  const caseStudy = project.caseStudy;
  const poster = `https://image.mux.com/${project.playbackId}/thumbnail.webp?time=1`;
  const title = `${project.people.map((person) => person.name).join(" & ")} · ${project.company}`;
  const rows = [
    { label: caseStudyCopy.company, text: caseStudy.company },
    { label: caseStudyCopy.moment, text: caseStudy.moment },
    { label: caseStudyCopy.whatWeDid, text: caseStudy.whatWeDid },
    ...(caseStudy.delivered
      ? [{ label: caseStudyCopy.delivered, text: caseStudy.delivered }]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12">
      <div className="text-center">
        <Link to="/work" className="text-[14px] text-muted hover:text-ink">
          ← {caseStudyCopy.back}
        </Link>
        <h1 className="mt-8 text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {project.company}
        </h1>
        <p className="mt-1 text-[16px] text-muted">
          {project.people.map((person, index) => (
            <span key={person.linkedin}>
              {index > 0 ? " & " : null}
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink hover:underline"
              >
                {person.name}
              </a>
            </span>
          ))}
        </p>
        {caseStudy.location ? (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[14px] text-muted">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.25" />
            </svg>
            {caseStudy.location}
          </p>
        ) : null}
      </div>

      {caseStudy.muxPlaybackId ? (
        <div className="mt-10">
          <MuxEmbed
            playbackId={caseStudy.muxPlaybackId}
            title={title}
            poster={`https://image.mux.com/${caseStudy.muxPlaybackId}/thumbnail.webp?time=1`}
          />
        </div>
      ) : caseStudy.youtubeId ? (
        <div className="mt-10">
          <YouTubeEmbed
            videoId={caseStudy.youtubeId}
            title={title}
            poster={poster}
          />
        </div>
      ) : null}

      <dl className="mx-auto mt-14 max-w-3xl divide-y divide-rail border-y border-rail">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
          >
            <dt className="pt-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
              {row.label}
            </dt>
            <dd className="text-pretty text-[16px] leading-relaxed md:text-[17px]">
              {paragraphWithLinks(row.text)}
            </dd>
          </div>
        ))}
      </dl>

      {caseStudy.quote ? (
        <figure className="mx-auto mt-16 max-w-3xl text-center">
          <blockquote className="text-balance text-[22px] font-medium leading-[1.25] tracking-[-0.03em] md:text-[28px]">
            “{caseStudy.quote.text}”
          </blockquote>
          <figcaption className="mt-3 text-[14px] text-muted">
            — {caseStudy.quote.author}
          </figcaption>
        </figure>
      ) : null}

      <div className="mt-20 flex flex-col items-center text-center">
        <p className="text-[22px] font-medium tracking-[-0.03em] md:text-[28px]">
          {caseStudyCopy.cta}
        </p>
        <Link
          to="/contact"
          className="mt-8 rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0]"
        >
          {copy.bookCall}
        </Link>
      </div>
    </div>
  );
}
