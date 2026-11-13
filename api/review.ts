// Returns the content of one client review page (/review/<address>).
//
// The reviews themselves are NOT part of this public repository. Each one is
// a small JSON file named <address>.json, kept in a private place:
//
//   - On Vercel: the folder "reviews" of a private GitHub repository.
//   - On your own machine: a local folder.
//
// Environment variables:
//   REVIEWS_REPO    the private repository, e.g. "chrismongang/cm-reviews"
//   REVIEWS_TOKEN   a GitHub token that may only read that repository
//   REVIEWS_DIR     local folder with the JSON files (used instead of GitHub
//                   when set, for `npm run dev`)

const validSlug = /^[a-z0-9][a-z0-9-]{7,99}$/;

async function loadReview(slug: string): Promise<string | null> {
  const dir = process.env.REVIEWS_DIR;
  if (dir) {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    return readFile(join(dir, `${slug}.json`), "utf8").catch(() => null);
  }

  const repo = process.env.REVIEWS_REPO;
  const token = process.env.REVIEWS_TOKEN;
  if (!repo || !token) return null;
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/reviews/${slug}.json`,
    {
      headers: {
        accept: "application/vnd.github.raw+json",
        authorization: `Bearer ${token}`,
        "user-agent": "review-pages",
      },
    },
  );
  return response.ok ? response.text() : null;
}

const headers = {
  "cache-control": "private, no-store",
  "x-robots-tag": "noindex, nofollow",
};

function escape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// The prebuilt, empty review page. Tries this deployment first, then the live
// site, so a client link never ends on an error page.
async function loadShell(request: Request) {
  for (const base of [request.url, "https://www.chrismongang.com"]) {
    const html = await fetch(new URL("/review", base))
      .then((response) => (response.ok ? response.text() : ""))
      .catch(() => "");
    if (html.includes('id="root"')) return html;
  }
  return "";
}

// The page itself, for /review/<address>. It is the prebuilt page /review with
// the film's title written into it, so link previews in Slack, WhatsApp and
// mail show "Review · <title>" instead of a generic name.
async function reviewPage(request: Request, slug: string) {
  const [shell, text] = await Promise.all([
    loadShell(request),
    validSlug.test(slug) ? loadReview(slug) : null,
  ]);
  let html = shell;
  try {
    const title = text ? (JSON.parse(text) as { title?: unknown }).title : null;
    if (typeof title === "string" && title) {
      const full = escape(`Review · ${title}`);
      html = shell.replace(
        /<title>[^<]*<\/title>/,
        `<title>${full}</title>\n    <meta property="og:title" content="${full}" />`,
      );
    }
  } catch {
    // Unreadable entry: the page then shows "not available" on its own.
  }
  return new Response(html, {
    headers: { ...headers, "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request) {
    const params = new URL(request.url).searchParams;
    const slug = params.get("slug") ?? "";
    if (params.has("page")) return reviewPage(request, slug);
    const text = validSlug.test(slug) ? await loadReview(slug) : null;
    if (!text) {
      return Response.json({ ok: false }, { status: 404, headers });
    }
    try {
      return Response.json({ ok: true, review: JSON.parse(text) }, { headers });
    } catch {
      return Response.json({ ok: false }, { status: 404, headers });
    }
  },
};
