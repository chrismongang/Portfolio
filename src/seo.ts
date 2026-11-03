import { copy } from "./copy.ts";
import { projects } from "./data/projects.ts";

// Link previews need absolute URLs, so this must be the live domain.
export const siteUrl = "https://chrismongang.vercel.app";

const siteName = "Chris Mongang";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
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
    title: `${project.company} – Dokumentation mit ${names}${place} · ${siteName}`,
    description:
      caseStudy.description ?? shorten(plainText(caseStudy.paragraphs[0])),
    image:
      caseStudy.ogImage ??
      `https://image.mux.com/${project.playbackId}/thumbnail.jpg?time=1&width=1200&height=630&fit_mode=smartcrop`,
  };
});

export const pages: PageMeta[] = [
  {
    path: "/",
    title: `${siteName} · Dokumentarische Videos für Gründerinnen und Gründer`,
    description: copy.subline,
  },
  {
    path: "/work",
    title: `${copy.workTitle} · ${siteName}`,
    description: `${copy.workSubline} von ${siteName}.`,
  },
  {
    path: "/contact",
    title: `${copy.contactTitle} · ${siteName}`,
    description: `15 Minuten mit ${siteName} über deine Gründungsgeschichte.`,
  },
  ...caseStudyPages,
];

export function pageForPath(path: string) {
  return pages.find((page) => page.path === path) ?? pages[0];
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
  const url = `${siteUrl}${page.path === "/" ? "" : page.path}`;
  const image = page.image?.startsWith("/")
    ? `${siteUrl}${page.image}`
    : page.image;
  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="de_DE" />`,
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
  return tags.join("\n    ");
}
