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
  /** True when a still from the film is stored next to the entry. */
  poster?: boolean;
  /** Only for videos where Chris asks for a summary or chapters. */
  summary?: string;
  chapters?: { time: string; title: string; text?: string }[];
};

/** One line of the overview that only Chris can open. */
type OverviewItem = {
  slug: string;
  client?: string;
  title?: string;
  status?: string;
  version?: string;
  updated?: string;
  poster?: boolean;
};

type State =
  | { step: "loading" }
  | { step: "missing" }
  | { step: "ready"; review: Review }
  | { step: "locked" }
  | { step: "overview"; items: OverviewItem[] };

const text = {
  review: {
    badge: "For review",
  },
  final: {
    badge: "Final version",
  },
  about: "About this cut",
  chapters: "Chapters",
  loadingPlayer: "Loading the player …",
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
  overviewBadge: "Only for you",
  overviewHint: "Clients never see this page",
  overviewTitle: "Review pages",
  overviewEmpty: "No review pages yet.",
  openPage: "Open",
  copy: "Copy link",
  copied: "Copied",
  password: "Password",
  unlock: "Open",
  wrongPassword: "That password is not right.",
};

function posterUrl(slug: string) {
  return `/api/review?image=1&slug=${encodeURIComponent(slug)}`;
}

function PrivatePill({ badge, hint }: { badge: string; hint: string }) {
  return (
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
      <span className="font-medium text-ink">{badge}</span>
      <span>{hint}</span>
    </p>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const final = status === "final";
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium text-ink ${
        final ? "bg-button" : "bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6]"
      }`}
    >
      {final ? text.final.badge : text.review.badge}
    </span>
  );
}

// All review pages at a glance, newest first, with the link to send.
function Overview({ items }: { items: OverviewItem[] }) {
  const [copied, setCopied] = useState("");
  const sorted = [...items].sort((a, b) =>
    (b.updated ?? "").localeCompare(a.updated ?? ""),
  );

  function copyLink(slug: string) {
    const link = `${window.location.origin}/review/${slug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(slug);
      window.setTimeout(() => setCopied(""), 2000);
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-6 md:px-12">
      <div className="text-center">
        <PrivatePill badge={text.overviewBadge} hint={text.overviewHint} />
        <h1 className="text-balance text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {text.overviewTitle}
        </h1>
        <p className="mt-3 text-[14px] text-muted">
          {sorted.length} {sorted.length === 1 ? "page" : "pages"}
        </p>
      </div>

      {sorted.length ? (
        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-rail border-y border-rail">
          {sorted.map((item) => (
            <li
              key={item.slug}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 py-5"
            >
              <div className="aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-rail">
                {item.poster ? (
                  <img
                    src={posterUrl(item.slug)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 basis-56">
                <p className="text-[13px] text-muted">{item.client}</p>
                <p className="text-pretty text-[16px] font-medium leading-snug">
                  {item.title}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                  <StatusBadge status={item.status} />
                  {item.version ? <span>{item.version}</span> : null}
                  {item.updated ? (
                    <span>{formatDate(item.updated)}</span>
                  ) : null}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyLink(item.slug)}
                  className="rounded-xl bg-button px-4 py-2 text-[14px] font-medium text-ink hover:bg-[#e8e8e8]"
                >
                  {copied === item.slug ? text.copied : text.copy}
                </button>
                <a
                  href={`/review/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-3 py-2 text-[14px] font-medium text-ink hover:underline"
                >
                  {text.openPage} ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-[16px] text-muted">
          {text.overviewEmpty}
        </p>
      )}
    </div>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// The overview asks for a password before it shows anything.
function Locked({
  slug,
  onOpen,
}: {
  slug: string;
  onOpen: (items: OverviewItem[]) => void;
}) {
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setWrong(false);
    const data = (await fetch(`/api/review?slug=${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .catch(() => null)) as { overview?: OverviewItem[] } | null;
    setBusy(false);
    if (Array.isArray(data?.overview)) onOpen(data.overview);
    else setWrong(true);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <PrivatePill badge={text.overviewBadge} hint={text.overviewHint} />
      <h1 className="text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
        {text.overviewTitle}
      </h1>
      <form onSubmit={submit} className="mt-8 flex w-full max-w-xs flex-col">
        <label htmlFor="overview-password" className="sr-only">
          {text.password}
        </label>
        <input
          id="overview-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder={text.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-placeholder bg-white px-4 py-2.5 text-[16px] text-ink outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-3 rounded-xl bg-gradient-to-r from-[#c9f4e6] to-[#b7e4f6] px-5 py-2.5 text-[15px] font-medium text-ink hover:from-[#bdecd9] hover:to-[#a6dcf0] disabled:opacity-60"
        >
          {text.unlock}
        </button>
        <p role="alert" className="mt-3 min-h-5 text-[14px] text-[#b3261e]">
          {wrong ? text.wrongPassword : ""}
        </p>
      </form>
    </div>
  );
}

export function Review() {
  const { slug } = useParams();
  const [state, setState] = useState<State>({ step: "loading" });
  // The Frame.io player stays dark for a few seconds after it starts loading.
  // Until then the still from the film is shown instead.
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/review?slug=${encodeURIComponent(slug ?? "")}`)
      .then((response) => response.json())
      .then(
        (
          data: {
            review?: Review;
            overview?: OverviewItem[];
            locked?: boolean;
          } | null,
        ) => {
          if (!active) return;
          if (data?.locked) {
            setState({ step: "locked" });
            document.title = text.overviewTitle;
            return;
          }
          if (Array.isArray(data?.overview)) {
            setState({ step: "overview", items: data.overview });
            document.title = text.overviewTitle;
            return;
          }
          if (!data?.review?.frameUrl) {
            setState({ step: "missing" });
            return;
          }
          setState({ step: "ready", review: data.review });
          document.title = `Review · ${data.review.title}`;
        },
      )
      .catch(() => {
        if (active) setState({ step: "missing" });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (state.step !== "ready") return;
    // Latest moment to show the player, in case it never reports back.
    const timer = window.setTimeout(() => setPlayerReady(true), 15000);
    return () => window.clearTimeout(timer);
  }, [state.step]);

  if (state.step === "overview") return <Overview items={state.items} />;

  if (state.step === "locked") {
    return (
      <Locked
        slug={slug ?? ""}
        onOpen={(items) => setState({ step: "overview", items })}
      />
    );
  }

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
        <PrivatePill badge={text.privateBadge} hint={text.privateHint} />
        <p className="text-[14px] text-muted">{review.client}</p>
        <h1 className="mt-3 text-balance text-[32px] font-medium tracking-[-0.03em] md:text-[40px]">
          {review.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-muted">
          <StatusBadge status={review.status} />
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>
      </div>

      <div className="relative mt-10 h-[78svh] min-h-[560px] w-full overflow-hidden rounded-xl bg-[#14151c]">
        <iframe
          src={review.frameUrl}
          title={review.title}
          allow="fullscreen; autoplay; clipboard-write"
          allowFullScreen
          onLoad={() => window.setTimeout(() => setPlayerReady(true), 4000)}
          className="h-full w-full border-0"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-[#14151c] transition-opacity duration-500 ${
            playerReady ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden={playerReady}
        >
          {review.poster && slug ? (
            <img
              src={posterUrl(slug)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          ) : null}
          <p className="relative flex items-center gap-3 rounded-full bg-black/55 px-5 py-2.5 text-[14px] font-medium text-white">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {text.loadingPlayer}
          </p>
        </div>
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
