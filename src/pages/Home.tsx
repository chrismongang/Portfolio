import { Link } from "react-router-dom";
import { LogoSlider } from "../components/LogoSlider";
import { LoopVideo } from "../components/LoopVideo";
import { Section } from "../components/Section";
import { copy, facts, home, servicePath } from "../copy";
import { projects } from "../data/projects";

// Placeholder until there is a dedicated showreel on Mux.
const showreel = projects.find((project) => project.id === "starlife")!;

const selectedWork = home.selectedWork.map((item) => ({
  ...item,
  project: projects.find((project) => project.caseStudy?.slug === item.slug)!,
}));

export function Home() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <section className="flex min-w-0 flex-col items-center px-6 pb-8 pt-16 text-center md:px-10 md:pt-24">
        <h1 className="w-full max-w-full text-balance text-[32px] font-medium leading-[1.12] tracking-[-0.04em] sm:text-[44px] md:text-[56px]">
          <span className="mb-5 block text-[14px] font-normal tracking-normal text-muted md:text-[15px]">
            {copy.eyebrow}
          </span>
          {copy.headline}
        </h1>
        <p className="mt-6 w-full max-w-full break-words text-pretty text-[15px] leading-relaxed text-muted md:max-w-[36rem] md:text-[18px]">
          {copy.subline}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/work"
            className="rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-[#e8e8e8]"
          >
            {copy.seeWork}
          </Link>
          <Link
            to="/contact"
            className="rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0]"
          >
            {copy.bookCall}
          </Link>
        </div>
        <div className="mt-16 w-full max-w-4xl">
          <LoopVideo playbackId={showreel.playbackId} title="Showreel" />
        </div>
      </section>

      <section className="px-0 pb-16 pt-10 md:pb-20">
        <p className="mb-8 text-center text-[13px] text-muted">
          {copy.workedWith}
        </p>
        <LogoSlider />
      </section>

      <Section title={home.forWhomTitle}>
        <dl className="mx-auto max-w-xl space-y-5">
          {home.forWhom.map((item) => (
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

      <Section title={home.selectedWorkTitle}>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-3">
          {selectedWork.map((item) => (
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
        <figure className="mt-20 text-center">
          <blockquote className="text-balance text-[22px] font-medium leading-[1.25] tracking-[-0.03em] md:text-[28px]">
            “{home.quote}”
          </blockquote>
          <figcaption className="mt-3 text-[14px] text-muted">
            — {home.quoteAuthor}
          </figcaption>
        </figure>
        <div className="mt-14 text-center">
          <Link to="/work" className="text-[15px] font-medium hover:underline">
            {home.seeAllWork} →
          </Link>
        </div>
      </Section>

      <Section title={home.howTitle}>
        <ol className="mx-auto max-w-xl space-y-10">
          {home.steps.map((step, index) => (
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
        <div className="mt-14 text-center">
          <Link
            to={servicePath}
            className="text-[15px] font-medium hover:underline"
          >
            {home.howMore} →
          </Link>
        </div>
      </Section>

      <Section wide>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <img
            src="/chris-mongang.jpg"
            alt="Chris Mongang with his camera"
            width={1200}
            height={1500}
            loading="lazy"
            className="aspect-[4/5] w-full bg-placeholder object-cover"
          />
          <div>
            <div className="space-y-5 text-pretty text-[16px] leading-relaxed md:text-[17px]">
              {home.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 text-[14px] text-muted">{home.location}</p>
            <Link
              to="/about"
              className="mt-8 inline-block rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-[#e8e8e8]"
            >
              {home.aboutMore}
            </Link>
          </div>
        </div>
      </Section>

      <Section title={home.faqTitle}>
        <div className="mx-auto max-w-xl divide-y divide-rail border-y border-rail">
          {home.faq.map((item) => (
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
          <span className="font-medium text-ink">{facts.label}: </span>
          {facts.text}
        </p>
      </Section>

      <Section>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[40px]">
            {home.closing}
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
