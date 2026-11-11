import {
  copy,
  facts,
  home,
  instagramUrl,
  linkedinUrl,
  notFound,
  servicePage,
  servicePageDe,
  servicePath,
  servicePathDe,
  xUrl,
  type ServiceContent,
} from "./copy.ts";
import { projects } from "./data/projects.ts";

// Link previews need absolute URLs, so this must be the live domain.
export const siteUrl = "https://www.chrismongang.com";

const siteName = "Chris Mongang";

// Preview image for pages without their own, built from design/og-default.svg.
const defaultImage = "/og/default.png";

// Photos of Chris for search engines, best first.
const aboutImages = [
  "/about/chris-mongang-portrait.jpg",
  "/chris-mongang.jpg",
  "/about/chris-mongang-filming-helicopter.jpg",
  "/about/chris-mongang-v2v-club-host.jpg",
  "/about/chris-mongang-boxing.jpg",
];

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
  /** Language of the page text. English unless set. */
  lang?: "en" | "de";
  /** The same page in other languages, including this one. */
  alternates?: { lang: string; path: string }[];
  /** Keeps the page out of search results and the sitemap. */
  noindex?: boolean;
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

const personId = `${siteUrl}/#person`;

/** Who Chris is. Every page that carries structured data includes this. */
const person = {
  "@type": "Person",
  "@id": personId,
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/chris-mongang.jpg`,
  jobTitle: "Founder Documentary Filmmaker",
  description: facts.text,
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
  knowsLanguage: ["de", "en"],
  sameAs: [linkedinUrl, xUrl, instagramUrl],
};

function faqJsonLd(
  url: string,
  items: readonly { question: string; answer: string }[],
  lang = "en",
) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: lang,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function isoDuration(seconds: number) {
  return `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
}

const caseStudyPages: PageMeta[] = projects.flatMap((project) => {
  const caseStudy = project.caseStudy;
  if (!caseStudy) return [];

  const names = project.people.map((person) => person.name).join(" & ");
  const place = caseStudy.location ? ` in ${caseStudy.location}` : "";
  const description =
    caseStudy.description ??
    shorten(plainText(`${caseStudy.company} ${caseStudy.whatWeDid}`));
  const image =
    caseStudy.ogImage ??
    `https://image.mux.com/${project.playbackId}/thumbnail.jpg?time=1&width=1200&height=630&fit_mode=smartcrop`;

  // Only published films: search engines need the publishing date.
  const video =
    caseStudy.youtubeId && caseStudy.published
      ? {
          "@context": "https://schema.org",
          "@graph": [
            person,
            {
              "@type": "VideoObject",
              name: `${project.company} – documentary with ${names}`,
              description,
              thumbnailUrl: image,
              uploadDate: caseStudy.published,
              ...(caseStudy.durationSeconds
                ? { duration: isoDuration(caseStudy.durationSeconds) }
                : {}),
              embedUrl: `https://www.youtube-nocookie.com/embed/${caseStudy.youtubeId}`,
              url: `https://www.youtube.com/watch?v=${caseStudy.youtubeId}`,
              creator: { "@id": personId },
            },
          ],
        }
      : undefined;

  return {
    path: `/work/${caseStudy.slug}`,
    title: `${project.company} – Documentary with ${names}${place} · ${siteName}`,
    description,
    image,
    jsonLd: video,
  };
});

const serviceAlternates = [
  { lang: "en", path: servicePath },
  { lang: "de", path: servicePathDe },
  { lang: "x-default", path: servicePath },
];

function serviceJsonLd(
  path: string,
  content: ServiceContent,
  name: string,
  lang: "en" | "de",
) {
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: "Documentary film production",
        description: `${content.what.text[0]} ${content.intro}`,
        url,
        inLanguage: lang,
        provider: { "@id": personId },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Startup founders, startups and scale-ups",
        },
        areaServed: [
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "Austria" },
          { "@type": "Country", name: "Switzerland" },
          { "@type": "Place", name: "Europe" },
          { "@type": "City", name: "New York" },
        ],
      },
      faqJsonLd(url, content.faq, lang),
    ],
  };
}

const notFoundPage: PageMeta = {
  path: "/404",
  title: `${notFound.title} · ${siteName}`,
  description: notFound.text,
  noindex: true,
};

export const pages: PageMeta[] = [
  {
    path: "/",
    title: `${siteName} · Founder Documentary Filmmaker, Berlin`,
    description: `${siteName} makes short documentaries with founders and their teams – for talent, investors and community. Based in Berlin, available across DACH, Europe and New York.`,
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        person,
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: siteName,
          publisher: { "@id": personId },
        },
        faqJsonLd(siteUrl, home.faq),
      ],
    },
  },
  {
    path: servicePath,
    title: `Founder Documentary Production for Startups · ${siteName}`,
    description: `Founder documentaries for startups and scale-ups in Germany and Europe. ${siteName} films founders and their teams for hiring, fundraising and launches. Based in Berlin.`,
    image: defaultImage,
    alternates: serviceAlternates,
    jsonLd: serviceJsonLd(
      servicePath,
      servicePage,
      "Founder documentary production",
      "en",
    ),
  },
  {
    path: servicePathDe,
    lang: "de",
    title: `Gründer-Doku & Startup-Dokumentation · ${siteName}`,
    description: `Gründer-Dokus für Startups und Scale-ups in Deutschland, Österreich und der Schweiz. ${siteName} begleitet Gründer und ihre Teams mit der Kamera – für Recruiting, Fundraising und Launches.`,
    image: defaultImage,
    alternates: serviceAlternates,
    jsonLd: serviceJsonLd(
      servicePathDe,
      servicePageDe,
      "Gründer-Doku: Dokumentarfilm-Produktion für Startups",
      "de",
    ),
  },
  {
    path: "/work",
    title: `${copy.workTitle} · ${siteName}`,
    description: `${copy.workSubline} by ${siteName}.`,
    image: defaultImage,
  },
  {
    path: "/contact",
    title: `${copy.contactTitle} · ${siteName}`,
    description: `15 minutes with ${siteName} about your founder story.`,
    image: defaultImage,
  },
  {
    path: "/about",
    title: `About ${siteName} · Founder Documentary Filmmaker`,
    description:
      "Founder documentary filmmaker based in Berlin. Before that: V2V Club, a street-football event and media brand with 30M+ views, and a bootstrapped sneaker brand.",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: `${siteUrl}/about`,
      mainEntity: {
        ...person,
        image: aboutImages.map((path) => `${siteUrl}${path}`),
      },
    },
  },
  ...caseStudyPages,
  notFoundPage,
];

export function pageForPath(path: string) {
  const clean = path.length > 1 ? path.replace(/\/$/, "") : path;
  return pages.find((page) => page.path === clean) ?? notFoundPage;
}

export function pageUrl(page: PageMeta) {
  return `${siteUrl}${page.path === "/" ? "" : page.path}`;
}

/** `date` is the day the site was built, as YYYY-MM-DD. */
export function sitemapXml(date: string) {
  const urls = pages
    .filter((page) => !page.noindex)
    .map(
      (page) =>
        `  <url><loc>${pageUrl(page)}</loc><lastmod>${date}</lastmod></url>`,
    )
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

/** A plain-text overview of the site for AI assistants (llmstxt.org). */
export function llmsTxt() {
  const caseStudies = caseStudyPages
    .map((page) => `- [${page.title}](${pageUrl(page)}): ${page.description}`)
    .join("\n");
  return `# ${siteName}

> ${facts.text}

## Pages

- [Founder documentaries](${siteUrl}${servicePath}): What a founder documentary is, who it is for, what you get and how it works
- [Gründer-Dokus](${siteUrl}${servicePathDe}): The same page in German
- [Work](${siteUrl}/work): All documentaries and founder stories
- [About](${siteUrl}/about): Chris Mongang's background and earlier projects
- [Contact](${siteUrl}/contact): Book a 15-minute call

## Case studies

${caseStudies}

## Profiles

- [LinkedIn](${linkedinUrl})
- [X](${xUrl})
- [Instagram](${instagramUrl})
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
  ];
  if (page.noindex) {
    tags.push(`<meta name="robots" content="noindex" />`);
    return tags.join("\n    ");
  }
  tags.push(
    `<link rel="canonical" href="${url}" />`,
    ...(page.alternates ?? []).map(
      (alternate) =>
        `<link rel="alternate" hreflang="${alternate.lang}" href="${siteUrl}${alternate.path}" />`,
    ),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${page.lang === "de" ? "de_DE" : "en_US"}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:site" content="@chris_mongang" />`,
    `<meta name="twitter:creator" content="@chris_mongang" />`,
  );
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
