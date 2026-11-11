import { Link } from "react-router-dom";
import { Globe } from "../components/Globe";
import { LoopVideo } from "../components/LoopVideo";
import { Section } from "../components/Section";
import type { ServiceContent } from "../copy";
import { projects } from "../data/projects";

/** Explains the offer in plain words. Used for the English and the German page. */
export function Service({ content }: { content: ServiceContent }) {
  const work = content.work.items.map((item) => ({
    ...item,
    project: projects.find((project) => project.caseStudy?.slug === item.slug)!,
  }));

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <section className="flex min-w-0 flex-col items-center px-6 pb-20 pt-16 text-center md:px-10 md:pb-28 md:pt-24">
        <h1 className="w-full max-w-3xl text-balance text-[32px] font-medium leading-[1.12] tracking-[-0.04em] sm:text-[44px] md:text-[56px]">
          <span className="mb-5 block text-[14px] font-normal tracking-normal text-muted md:text-[15px]">
            {content.eyebrow}
          </span>
          {content.title}
        </h1>
        <p className="mt-6 w-full max-w-[36rem] text-pretty text-[15px] leading-relaxed text-muted md:text-[18px]">
          {content.intro}
        </p>
        <Link
          to="/contact"
          className="mt-10 rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0]"
        >
          {content.cta}
        </Link>
      </section>

      <Section title={content.what.title}>
        <div className="mx-auto max-w-xl space-y-5 text-pretty text-[16px] leading-relaxed md:text-[17px]">
          {content.what.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title={content.forWhom.title}>
        <dl className="mx-auto max-w-xl space-y-5">
          {content.forWhom.items.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6"
            >
              <dt className="text-[16px] font-medium md:text-[17px]">
                {item.label}
              </dt>
              <dd className="text-[16px] text-muted md:text-[17px]">
                {item.text}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={content.deliverables.title}>
        <ul className="mx-auto max-w-xl divide-y divide-rail border-y border-rail">
          {content.deliverables.items.map((item) => (
            <li
              key={item}
              className="py-4 text-[16px] leading-relaxed md:text-[17px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={content.steps.title}>
        <ol className="mx-auto max-w-xl space-y-10">
          {content.steps.items.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4"
            >
              <span className="pt-0.5 text-[14px] tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[17px] font-medium">{step.title}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={content.work.title} wide>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
          {work.map((item) => (
            <li key={item.slug}>
              <Link to={`/work/${item.slug}`} className="group block">
                <LoopVideo
                  playbackId={item.project.playbackId}
                  title={item.title}
                />
                <h3 className="mt-3 text-[16px] font-medium tracking-[-0.01em] group-hover:underline">
                  {item.title}
                </h3>
                <p className="mt-1 text-[14px] leading-snug text-muted">
                  {item.text}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-14 text-center">
          <Link to="/work" className="text-[15px] font-medium hover:underline">
            {content.work.all} →
          </Link>
        </div>
      </Section>

      <Section title={content.where.title} wide>
        <p className="mx-auto max-w-xl text-pretty text-center text-[16px] leading-relaxed md:text-[17px]">
          {content.where.text}
        </p>
        <Globe labels={content.where.globe} lang={content.lang} />
      </Section>

      <Section title={content.faqTitle}>
        <div className="mx-auto max-w-xl divide-y divide-rail border-y border-rail">
          {content.faq.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium md:text-[17px] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  className="text-[20px] font-normal leading-none text-muted transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-[16px] leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-14 max-w-xl text-pretty text-[14px] leading-relaxed text-muted">
          <span className="font-medium text-ink">{content.facts.label}: </span>
          {content.facts.text}
        </p>
      </Section>

      <Section>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
            {content.closing}
          </h2>
          <Link
            to="/contact"
            className="mt-10 rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0]"
          >
            {content.cta}
          </Link>
          <Link
            to={content.otherLanguage.path}
            className="mt-8 text-[14px] text-muted hover:text-ink"
          >
            {content.otherLanguage.text}
          </Link>
        </div>
      </Section>
    </div>
  );
}
