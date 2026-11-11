import { Link } from "react-router-dom";
import { notFound } from "../copy";

export function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
        {notFound.title}
      </h1>
      <p className="mt-3 text-[16px] text-muted">{notFound.text}</p>
      <Link
        to="/"
        className="mt-10 rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-[#e8e8e8]"
      >
        {notFound.home}
      </Link>
    </div>
  );
}
