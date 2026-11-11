import type { LegalPage } from "../legal";

export function Legal({ content }: { content: LegalPage }) {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 pt-10 md:pt-16">
      <h1 className="text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
        {content.title}
      </h1>
      {content.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-[17px] font-medium md:text-[18px]">
            {section.heading}
          </h2>
          {section.lines.map((line) => (
            <p
              key={line}
              className="mt-3 whitespace-pre-line text-pretty text-[16px] leading-relaxed text-muted"
            >
              {line}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
