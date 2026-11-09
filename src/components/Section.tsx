import type { ReactNode } from "react";

export function Section({
  title,
  wide,
  children,
}: {
  title?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mx-6 border-t border-rail py-20 md:mx-10 md:py-28">
      <div className={`mx-auto w-full ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        {title ? (
          <h2 className="mb-12 text-balance text-center text-[24px] font-medium leading-[1.2] tracking-[-0.03em] md:text-[32px]">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}
