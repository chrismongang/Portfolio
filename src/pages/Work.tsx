import { LoopVideo } from "../components/LoopVideo";
import { copy } from "../copy";
import { projects } from "../data/projects";

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
        {projects.map((project) => (
          <li key={project.id}>
            <article>
              <LoopVideo
                playbackId={project.playbackId}
                title={`${project.people.map((person) => person.name).join(" & ")} · ${project.company}`}
              />
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
