// Returns the content of one client review page (/review/<address>).
//
// The reviews themselves are NOT part of this public repository. Each one is
// a small JSON file named <address>.json, optionally with a still from the film
// named <address>.jpg, kept in a private place:
//
//   - On Vercel: the folder "reviews" of a private GitHub repository.
//   - On your own machine: a local folder.
//
// Environment variables:
//   REVIEWS_REPO    the private repository, e.g. "chrismongang/cm-reviews"
//   REVIEWS_TOKEN   a GitHub token that may only read that repository
//   REVIEWS_OVERVIEW  secret address of the overview of all review pages
//   REVIEWS_DIR     local folder with the JSON files (used instead of GitHub
//                   when set, for `npm run dev`)

const validSlug = /^[a-z0-9][a-z0-9-]{7,99}$/;
const site = "https://www.chrismongang.com";

function github(path: string, accept: string) {
  const repo = process.env.REVIEWS_REPO;
  const token = process.env.REVIEWS_TOKEN;
  if (!repo || !token) return null;
  return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: {
      accept,
      authorization: `Bearer ${token}`,
      "user-agent": "review-pages",
    },
  });
}

/** One file from the private store, e.g. "<address>.json" or "<address>.jpg". */
async function loadFile(name: string): Promise<Uint8Array | null> {
  const dir = process.env.REVIEWS_DIR;
  if (dir) {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    return readFile(join(dir, name)).catch(() => null);
  }
  const response = await github(
    `reviews/${name}`,
    "application/vnd.github.raw+json",
  );
  return response?.ok ? new Uint8Array(await response.arrayBuffer()) : null;
}

async function loadReview(slug: string): Promise<string | null> {
  const file = await loadFile(`${slug}.json`);
  return file ? new TextDecoder().decode(file) : null;
}

/** The addresses of all review pages in the private store. */
async function listSlugs(): Promise<string[]> {
  let names: string[] = [];
  const dir = process.env.REVIEWS_DIR;
  if (dir) {
    const { readdir } = await import("node:fs/promises");
    names = await readdir(dir).catch(() => []);
  } else {
    const response = await github("reviews", "application/vnd.github+json");
    const files = response?.ok ? ((await response.json()) as unknown) : [];
    if (Array.isArray(files)) {
      names = files.map((file: { name?: unknown }) => String(file.name));
    }
  }
  return names
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length))
    .filter((slug) => validSlug.test(slug));
}

// The overview of all review pages, for Chris only. It opens under a secret
// address stored in REVIEWS_OVERVIEW, never under a guessable one.
async function overview() {
  const slugs = await listSlugs();
  const items = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const review = JSON.parse((await loadReview(slug)) ?? "") as Record<
          string,
          unknown
        >;
        return {
          slug,
          client: review.client,
          title: review.title,
          status: review.status,
          version: review.version,
          updated: review.updated,
          poster: review.poster === true,
        };
      } catch {
        return null;
      }
    }),
  );
  return items.filter((item) => item !== null);
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
    const review = text
      ? (JSON.parse(text) as { title?: unknown; poster?: unknown })
      : null;
    if (typeof review?.title === "string" && review.title) {
      const full = escape(`Review · ${review.title}`);
      const tags = [
        `<title>${full}</title>`,
        `<meta property="og:title" content="${full}" />`,
      ];
      if (review.poster === true) {
        const image = escape(`${site}/api/review?image=1&slug=${slug}`);
        tags.push(
          `<meta property="og:image" content="${image}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
        );
      }
      html = shell.replace(/<title>[^<]*<\/title>/, tags.join("\n    "));
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

    // The still shown while the player loads and in link previews.
    if (params.has("image")) {
      const image = validSlug.test(slug) ? await loadFile(`${slug}.jpg`) : null;
      if (!image) return new Response(null, { status: 404, headers });
      return new Response(image.slice().buffer as ArrayBuffer, {
        headers: {
          ...headers,
          "cache-control": "private, max-age=86400",
          "content-type": "image/jpeg",
        },
      });
    }

    const overviewSlug = process.env.REVIEWS_OVERVIEW ?? "";
    if (validSlug.test(overviewSlug) && slug === overviewSlug) {
      return Response.json(
        { ok: true, overview: await overview() },
        { headers },
      );
    }

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
