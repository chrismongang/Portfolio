import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// A private page for one client video: /review/<address>.
// The client watches the cut in the Frame.io player and comments right there.
// What the page shows comes from api/review.ts, not from this repository.

type Review = {
  client: string;
  title: string;
  /** "review" asks for feedback, "final" offers the finished film. */
  status: "review" | "final";
  /** Optional label such as "Version 2". */
  version?: string;
  updated?: string;
  frameUrl: string;
  /** Only for videos where Chris asks for a summary or chapters. */
  summary?: string;
  chapters?: { time: string; title: string; text?: string }[];
};

type State =
  { step: "loading" } | { step: "missing" } | { step: "ready"; review: Review };

const text = {
  review: {
    badge: "For review",
  },
  final: {
    badge: "Final version",
  },
  about: "About this cut",
  chapters: "Chapters",
  open: "Open in Frame.io",
  openHint: "Player not loading, or prefer the full view?",
  privateBadge: "Private page",
  privateHint: "Only visible to people with this link",
  privateNote:
    "This page is not part of the public website. It is not listed anywhere, cannot be found through search engines, and only opens with this exact link.",
  website: "Visit my website",
  missingTitle: "This review page is not available",
  missingText:
    "The link may be incomplete or the page has been taken down. Please ask Chris for a new link.",
  home: "Go to the homepage",
};

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Review() {
  const { slug } = useParams();
  const [state, setState] = useState<State>({ step: "loading" });

  useEffect(() => {
    let active = true;
    fetch(`/api/review?slug=${encodeURIComponent(slug ?? "")}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { review?: Review } | null) => {
        if (!active) return;
        if (!data?.review?.frameUrl) {
          setState({ step: "missing" });
          return;
        }
        setState({ step: "ready", review: data.review });
        document.title = `${data.review.title} · ${data.review.client}`;
      })
      .catch(() => {
        if (active) setState({ step: "missing" });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (state.step === "loading") {
    return (
      <div
        className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12"
        aria-busy="true"
      >
        <div className="mx-auto mt-8 h-10 w-2/3 max-w-md bg-rail" />
        <div className="mt-10 aspect-video w-full bg-rail" />
      </div>
    );
  }

  if (state.step === "missing") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {text.missingTitle}
        </h1>
        <p className="mt-3 max-w-md text-pretty text-[16px] text-muted">
          {text.missingText}
        </p>
        <Link
          to="/"
          className="mt-10 rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-[#e8e8e8]"
        >
          {text.home}
        </Link>
      </div>
    );
  }

  const { review } = state;
  const mode = review.status === "final" ? text.final : text.review;
  const meta = [
    review.version,
    review.updated ? formatDate(review.updated) : undefined,
  ].filter(Boolean);
  const rows = [
    ...(review.summary
      ? [{ label: text.about, content: <p>{review.summary}</p> }]
      : []),
    ...(review.chapters?.length
      ? [
          {
            label: text.chapters,
            content: (
              <ol className="space-y-4">
                {review.chapters.map((chapter) => (
                  <li
                    key={chapter.time}
                    className="grid grid-cols-[3.5rem_1fr] gap-2"
                  >
                    <span className="tabular-nums text-muted">
                      {chapter.time}
                    </span>
                    <span>
                      <span className="font-medium">{chapter.title}</span>
                      {chapter.text ? (
                        <span className="mt-0.5 block text-[15px] text-muted">
                          {chapter.text}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12">
      <div className="text-center">
        <p className="mb-8 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-rail px-4 py-2 text-[13px] text-muted">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 text-ink"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span className="font-medium text-ink">{text.privateBadge}</span>
          <span>{text.privateHint}</span>
        </p>
        <p className="text-[14px] text-muted">{review.client}</p>
        <h1 className="mt-3 text-balance text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {review.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-muted">
          <span className="rounded-full bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-3 py-1 font-medium text-ink">
            {mode.badge}
          </span>
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>
      </div>

      <div className="mt-10 h-[78svh] min-h-[560px] w-full overflow-hidden rounded-xl bg-[#14151c]">
        <iframe
          src={review.frameUrl}
          title={review.title}
          allow="fullscreen; autoplay; clipboard-write"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <p className="mt-4 text-center text-[14px] text-muted">
        {text.openHint}{" "}
        <a
          href={review.frameUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-ink underline underline-offset-[3px]"
        >
          {text.open} ↗
        </a>
      </p>

      {rows.length ? (
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
                {row.content}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mx-auto mt-14 flex max-w-xl flex-col items-center text-center">
        <p className="text-pretty text-[14px] leading-relaxed text-muted">
          {text.privateNote}
        </p>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 rounded-xl bg-button px-5 py-2.5 text-[15px] font-medium text-ink hover:bg-[#e8e8e8]"
        >
          {text.website} ↗
        </a>
      </div>
    </div>
  );
}
