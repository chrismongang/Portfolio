import { copy, instagramUrl, linkedinUrl } from "./copy.ts";
import { projects } from "./data/projects.ts";

// Link previews need absolute URLs, so this must be the live domain.
export const siteUrl = "https://www.chrismongang.com";

const siteName = "Chris Mongang";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
  /** Structured data for search engines (schema.org JSON-LD). */
  jsonLd?: object;
};

function plainText(paragraph: string) {
  return paragraph.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function shorten(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max - 1))} …`;
}

const caseStudyPages: PageMeta[] = projects.flatMap((project) => {
  const caseStudy = project.caseStudy;
  if (!caseStudy) return [];

  const names = project.people.map((person) => person.name).join(" & ");
  const place = caseStudy.location ? ` in ${caseStudy.location}` : "";

  return {
    path: `/work/${caseStudy.slug}`,
    title: `${project.company} – Documentary with ${names}${place} · ${siteName}`,
    description:
      caseStudy.description ??
      shorten(plainText(`${caseStudy.company} ${caseStudy.whatWeDid}`)),
    image:
      caseStudy.ogImage ??
      `https://image.mux.com/${project.playbackId}/thumbnail.jpg?time=1&width=1200&height=630&fit_mode=smartcrop`,
  };
});

export const pages: PageMeta[] = [
  {
    path: "/",
    title: `${siteName} · Founder Documentary Filmmaker, Berlin`,
    description: `${siteName} makes short documentaries with founders and their teams – for talent, investors and community. Based in Berlin, filming across DACH and New York.`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: siteName,
          url: siteUrl,
          image: `${siteUrl}/chris.jpg`,
          jobTitle: "Founder Documentary Filmmaker",
          description: copy.subline,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Berlin",
            addressCountry: "DE",
          },
          knowsAbout: [
            "Documentary filmmaking",
            "Founder documentaries",
            "Startup storytelling",
            "Video production",
          ],
          sameAs: [linkedinUrl, instagramUrl],
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: siteName,
          publisher: { "@id": `${siteUrl}/#person` },
        },
      ],
    },
  },
  {
    path: "/work",
    title: `${copy.workTitle} · ${siteName}`,
    description: `${copy.workSubline} by ${siteName}.`,
  },
  {
    path: "/contact",
    title: `${copy.contactTitle} · ${siteName}`,
    description: `15 minutes with ${siteName} about your founder story.`,
  },
  ...caseStudyPages,
];

export function pageForPath(path: string) {
  return pages.find((page) => page.path === path) ?? pages[0];
}

export function pageUrl(page: PageMeta) {
  return `${siteUrl}${page.path === "/" ? "" : page.path}`;
}

export function sitemapXml() {
  const urls = pages
    .map((page) => `  <url><loc>${pageUrl(page)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function escape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Head tags that crawlers read, since they don't run the app's JavaScript. */
export function headTags(page: PageMeta) {
  const url = pageUrl(page);
  const image = page.image?.startsWith("/")
    ? `${siteUrl}${page.image}`
    : page.image;
  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
  ];
  if (image) {
    tags.push(
      `<meta property="og:image" content="${escape(image)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
    );
  }
  if (page.jsonLd) {
    // "<" is escaped so the JSON can't close the script tag early.
    const json = JSON.stringify(page.jsonLd).replaceAll("<", "\\u003c");
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.join("\n    ");
}
