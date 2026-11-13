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

export default {
  async fetch(request: Request) {
    const slug = new URL(request.url).searchParams.get("slug") ?? "";
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
