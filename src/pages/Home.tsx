import { Link } from "react-router-dom";
import { LogoSlider } from "../components/LogoSlider";
import { copy } from "../copy";

export function Home() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <section className="flex min-w-0 flex-1 flex-col items-center justify-center px-6 pb-8 pt-16 text-center md:px-10 md:pt-24">
        <h1 className="w-full max-w-full text-balance text-[28px] font-medium leading-[1.12] tracking-[-0.04em] sm:text-[40px] md:text-[56px]">
          {copy.headlineLead}{" "}
          <span className="md:block">{copy.headlineTail}</span>
        </h1>
        <p className="mt-6 w-full max-w-full break-words text-pretty text-[15px] leading-relaxed text-muted md:max-w-[34rem] md:text-[18px]">
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
      </section>

      <section className="px-0 pb-8 pt-10 md:pb-12">
        <p className="mb-8 text-center text-[13px] text-muted">
          {copy.workedWith}
        </p>
        <LogoSlider />
      </section>
    </div>
  );
}
