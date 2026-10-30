import { Link } from "react-router-dom";
import { LoopVideo } from "../components/LoopVideo";
import { rememberPortfolioScroll } from "../components/ScrollManager";
import { copy } from "../copy";
import { projects, type Project } from "../data/projects";

function portfolioRank(project: Project) {
  if (project.caseStudy?.slug === "franz-purucker") return 0;
  if (project.caseStudy?.slug === "bonn-open") return 1;
  if (project.caseStudy) return 2;
  return 3;
}

const orderedProjects = [...projects].sort((a, b) => {
  const difference = portfolioRank(a) - portfolioRank(b);
  if (difference !== 0) return difference;
  return projects.indexOf(a) - projects.indexOf(b);
});

export function Work() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12">
      <div className="mb-12 text-center">
        <h1 className="text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {copy.workTitle}
        </h1>
        <p className="mt-3 text-[16px] text-muted">{copy.workSubline}</p>
      </div>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
        {orderedProjects.map((project) => (
          <li key={project.id}>
            <article>
              <div className="relative">
                <LoopVideo
                  playbackId={project.playbackId}
                  title={`${project.people.map((person) => person.name).join(" & ")} · ${project.company}`}
                />
                {project.caseStudy ? (
                  <Link
                    to={`/work/${project.caseStudy.slug}`}
                    onClick={rememberPortfolioScroll}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 text-white opacity-0 backdrop-blur-lg transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
                  >
                    <span className="inline-flex items-start text-[32px] font-medium leading-none tracking-[-0.03em] md:text-[40px]">
                      Case Study
                      <svg
                        viewBox="0 0 24 24"
                        className="ml-2 mt-1 h-[0.62em] w-[0.62em]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17 17 7M9 7h8v8"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : null}
              </div>
              <h2 className="mt-3 text-[16px] font-medium tracking-[-0.01em]">
                {project.people.map((person, index) => (
                  <span key={person.linkedin}>
                    {index > 0 ? " & " : null}
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {person.name}
                    </a>
                  </span>
                ))}
              </h2>
              <p className="mt-1 text-[14px] text-muted">{project.company}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
