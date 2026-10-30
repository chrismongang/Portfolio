import { Link, Navigate, useParams } from "react-router-dom";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { projects } from "../data/projects";

const unicornBakeryName = "Unicorn Bakery";
const unicornBakeryUrl = "https://unicornbakery.de/de";

function paragraphWithLinks(paragraph: string) {
  const parts = paragraph.split(unicornBakeryName);

  return parts.map((part, index) => (
    <span key={index}>
      {index > 0 ? (
        <a
          href={unicornBakeryUrl}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-[3px]"
        >
          {unicornBakeryName}
        </a>
      ) : null}
      {part}
    </span>
  ));
}

export function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((item) => item.caseStudy?.slug === slug);

  if (!project?.caseStudy) {
    return <Navigate to="/work" replace />;
  }

  const poster = `https://image.mux.com/${project.playbackId}/thumbnail.webp?time=1`;
  const title = `${project.people.map((person) => person.name).join(" & ")} · ${project.company}`;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12">
      <div className="text-center">
        <Link to="/work" className="text-[14px] text-muted hover:text-ink">
          ← Portfolio
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
        {project.caseStudy.location ? (
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
            {project.caseStudy.location}
          </p>
        ) : null}
      </div>

      <div className="mt-10 space-y-5 text-[16px] leading-relaxed md:text-[18px]">
        {project.caseStudy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraphWithLinks(paragraph)}</p>
        ))}
      </div>

      <div className="mt-10">
        <YouTubeEmbed
          videoId={project.caseStudy.youtubeId}
          title={title}
          poster={poster}
        />
      </div>
    </div>
  );
}
