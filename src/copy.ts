export const copy = {
  eyebrow: "Chris Mongang · Founder documentaries",
  headline: "Documenting the people building tomorrow.",
  subline:
    "I spend days with founders and their teams and turn the messy, unpolished, world-changing part into short documentaries for talent, investors and your community.",
  seeWork: "Work",
  bookCall: "Book a call",
  workedWith: "Founders I've filmed with",
  workTitle: "Work",
  workSubline: "Documentaries and founder stories",
  contactTitle: "Book a call",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  about: "About",
  service: "Founder documentaries",
} as const;

export const home = {
  forWhomTitle: "For founders who are too busy building to capture it.",
  forWhom: [
    {
      label: "Raising",
      text: "Investors see the team in action, not a deck.",
    },
    {
      label: "Hiring",
      text: "Candidates meet your culture before the first call.",
    },
    {
      label: "Launching",
      text: "Show the build behind the product.",
    },
  ],
  selectedWorkTitle: "Selected work",
  selectedWork: [
    {
      slug: "starlife",
      title: "Starlife",
      text: "Humanoid robots, 5 days in New York",
    },
    {
      slug: "cortea",
      title: "Cortea",
      text: "How an AI startup actually gets built",
    },
    {
      slug: "bonn-open",
      title: "Bonn Open",
      text: "He sold LeanIX – then built a tennis tournament",
    },
  ],
  quote: "Holy sh*t. And that's only the teaser?",
  quoteAuthor: "Leander Maerkisch, Starlife",
  seeAllWork: "See all work",
  howTitle: "How it works",
  steps: [
    {
      title: "Pilot",
      text: "1 - 2 days with you and your team. One short documentary and clips, delivered within two weeks.",
    },
    {
      title: "Partnership",
      text: "A few shoot days every month. Your story, captured as it happens -> episodes, clips and an archive that grows.",
    },
    {
      title: "Flagship film",
      text: "When the story is ready, a longer film from everything we've captured. Length follows the story.",
    },
  ],
  about: [
    "In April 2026, I flew to New York for a vacation. Two days later, I was filming in the workshop of Starlife, a humanoid robotics startup.",
    "Before that, I built businesses myself - a D2C-brand and a street-football event & media brand. I know how much of building never makes it to the outside.",
  ],
  location: "Berlin · New York",
  aboutMore: "More about me",
  faqTitle: "Questions",
  faq: [
    {
      question: "How much of our time does it take?",
      answer:
        "Almost none. I shadow your day – one interview of about an hour at most.",
    },
    {
      question: "What about confidential tech?",
      answer: "NDA by default. Nothing goes public without your approval.",
    },
    {
      question: "Who owns the footage?",
      answer:
        "You can use everything on all your channels. I only show work you've approved.",
    },
    {
      question: "Where do you work?",
      answer:
        "Based in Berlin. Working across Germany, the DACH region, Europe and New York.",
    },
    {
      question: "Do you film in German or English?",
      answer: "Both.",
    },
  ],
  howMore: "What a founder documentary is and what you get",
  closing: "Raising, launching or hiring? Let's talk.",
} as const;

/** The plain facts in third person, so search engines and AI assistants can quote them. */
export const facts = {
  label: "In short",
  text: "Chris Mongang is a documentary filmmaker based in Berlin. He produces founder documentaries: short films that follow startup founders and their teams through real working days, made for hiring, fundraising and launches. He has filmed with the founders of Starlife, Cortea, Pliant, Plancraft, Aniva Health, Bonn Open and Tech Europe, and developed the “Day with” format for the founder podcast Unicorn Bakery. He works across Germany, the DACH region and Europe, and in New York.",
} as const;

export type ServiceContent = {
  eyebrow: string;
  title: string;
  intro: string;
  what: { title: string; text: string[] };
  forWhom: { title: string; items: { label: string; text: string }[] };
  deliverables: { title: string; items: string[] };
  steps: { title: string; items: { title: string; text: string }[] };
  where: { title: string; text: string };
  work: {
    title: string;
    items: { slug: string; title: string; text: string }[];
    all: string;
  };
  faqTitle: string;
  faq: { question: string; answer: string }[];
  facts: { label: string; text: string };
  closing: string;
  cta: string;
  /** Link to the same page in the other language. */
  otherLanguage: { text: string; path: string };
};

export const servicePath = "/founder-documentary";
export const servicePathDe = "/de/gruender-doku";

export const servicePage: ServiceContent = {
  eyebrow: "Founder documentaries",
  title: "Founder documentaries for startups and scale-ups",
  intro:
    "Short documentaries that show how your company is actually being built – for hiring, fundraising and launches.",
  what: {
    title: "What is a founder documentary?",
    text: [
      "A founder documentary is a short film that shows how a company is actually being built. No script, no actors, no studio.",
      "I spend one or more days with the founder and the team, film the real work, and add one interview of about an hour. The result is a film people watch to the end because nothing in it is staged.",
    ],
  },
  forWhom: {
    title: "Who it's for",
    items: [
      {
        label: "Raising",
        text: "Founders who are raising: investors see the team in action, not a deck.",
      },
      {
        label: "Hiring",
        text: "Startups and scale-ups that are hiring: candidates meet your culture before the first call.",
      },
      {
        label: "Launching",
        text: "Teams that are launching: show the build behind the product.",
      },
    ],
  },
  deliverables: {
    title: "What you get",
    items: [
      "One short documentary about you and your team",
      "Short clips cut from the same footage, for LinkedIn and social",
      "Delivered within two weeks of the shoot",
      "The right to use everything on all your channels, including YouTube, LinkedIn and your website",
    ],
  },
  steps: {
    title: "How it works",
    items: home.steps.map((step) => ({ ...step })),
  },
  where: {
    title: "Where I work",
    text: "Based in Berlin. I film across Germany, Austria and Switzerland, in the rest of Europe, and in New York. Films are produced in German or English.",
  },
  work: {
    title: "Founder documentaries I've made",
    items: [
      {
        slug: "starlife",
        title: "Starlife",
        text: "Humanoid robotics startup – 5 days in New York and Pittsburgh",
      },
      {
        slug: "cortea",
        title: "Cortea",
        text: "A day inside a Berlin AI startup",
      },
      {
        slug: "bonn-open",
        title: "Bonn Open",
        text: "André Christ sold LeanIX to SAP – then built a tennis tournament",
      },
      {
        slug: "tech-europe",
        title: "Tech Europe",
        text: "The 24 hours before an AI conference opens in Berlin",
      },
      {
        slug: "macher-festival",
        title: "Macher Festival",
        text: "Behind the scenes of a festival for thousands of young makers",
      },
      {
        slug: "tech-europe-hackathon",
        title: "Tech Europe Hackathon",
        text: "Two founders, one hackathon: from the first idea to the pitch",
      },
    ],
    all: "See all work",
  },
  faqTitle: "Questions",
  faq: [
    {
      question: "Who produces founder documentaries in Germany?",
      answer:
        "Chris Mongang is a Berlin-based filmmaker who specialises in documentaries about startup founders. He has filmed with founders in Berlin, Bonn, New York and Pittsburgh.",
    },
    {
      question:
        "How is a founder documentary different from a corporate video?",
      answer:
        "A corporate video is scripted and shows the company the way marketing wants it to look. A founder documentary follows real days and keeps the unpolished parts in. That is why people trust it.",
    },
    {
      question: "How long does it take?",
      answer:
        "A pilot takes 1–2 shoot days. You get the film and clips within two weeks.",
    },
    {
      question: "Can we use the film on YouTube and LinkedIn?",
      answer: "Yes. You can use everything on all your channels.",
    },
    {
      question: "How much of our time does it take?",
      answer:
        "Almost none. I shadow your day – one interview of about an hour at most.",
    },
    {
      question: "What about confidential tech?",
      answer: "NDA by default. Nothing goes public without your approval.",
    },
  ],
  facts,
  closing: "Want a documentary about your company?",
  cta: copy.bookCall,
  otherLanguage: { text: "Diese Seite auf Deutsch", path: servicePathDe },
};

export const servicePageDe: ServiceContent = {
  eyebrow: "Gründer-Dokus",
  title: "Gründer-Dokus für Startups und Scale-ups",
  intro:
    "Kurze Dokumentarfilme, die zeigen, wie euer Unternehmen wirklich gebaut wird – für Recruiting, Fundraising und Launches.",
  what: {
    title: "Was ist eine Gründer-Doku?",
    text: [
      "Eine Gründer-Doku ist ein kurzer Dokumentarfilm, der zeigt, wie ein Unternehmen wirklich gebaut wird. Ohne Drehbuch, ohne Schauspieler, ohne Studio.",
      "Ich begleite Gründerin oder Gründer und das Team einen oder mehrere Tage mit der Kamera, filme die echte Arbeit und führe ein Interview von etwa einer Stunde. Heraus kommt ein Film, den Menschen bis zum Ende schauen, weil nichts darin gestellt ist.",
    ],
  },
  forWhom: {
    title: "Für wen",
    items: [
      {
        label: "Fundraising",
        text: "Gründer in einer Finanzierungsrunde: Investoren sehen das Team bei der Arbeit, nicht nur ein Deck.",
      },
      {
        label: "Recruiting",
        text: "Startups und Scale-ups, die einstellen: Kandidaten lernen eure Kultur vor dem ersten Gespräch kennen.",
      },
      {
        label: "Launch",
        text: "Teams vor einem Launch: zeigt, was hinter dem Produkt steckt.",
      },
    ],
  },
  deliverables: {
    title: "Was ihr bekommt",
    items: [
      "Eine kurze Doku über euch und euer Team",
      "Kurze Clips aus demselben Material, für LinkedIn und Social Media",
      "Lieferung innerhalb von zwei Wochen nach dem Dreh",
      "Das Recht, alles auf allen euren Kanälen zu nutzen – auch auf YouTube, LinkedIn und eurer Website",
    ],
  },
  steps: {
    title: "So läuft es ab",
    items: [
      {
        title: "Pilot",
        text: "1–2 Tage mit euch und eurem Team. Eine kurze Doku und Clips, geliefert innerhalb von zwei Wochen.",
      },
      {
        title: "Partnerschaft",
        text: "Ein paar Drehtage pro Monat. Eure Geschichte wird festgehalten, während sie passiert – als Episoden, Clips und ein Archiv, das wächst.",
      },
      {
        title: "Flagship-Film",
        text: "Wenn die Geschichte so weit ist: ein längerer Film aus allem, was wir gedreht haben. Die Länge richtet sich nach der Geschichte.",
      },
    ],
  },
  where: {
    title: "Wo ich arbeite",
    text: "Ich sitze in Berlin und drehe in ganz Deutschland, Österreich und der Schweiz, im übrigen Europa und in New York. Die Filme entstehen auf Deutsch oder Englisch.",
  },
  work: {
    title: "Gründer-Dokus, die ich gedreht habe",
    items: [
      {
        slug: "starlife",
        title: "Starlife",
        text: "Startup für humanoide Roboter – 5 Tage in New York und Pittsburgh",
      },
      {
        slug: "cortea",
        title: "Cortea",
        text: "Ein Tag in einem Berliner KI-Startup",
      },
      {
        slug: "bonn-open",
        title: "Bonn Open",
        text: "André Christ verkaufte LeanIX an SAP – und baute dann ein Tennisturnier",
      },
      {
        slug: "tech-europe",
        title: "Tech Europe",
        text: "Die 24 Stunden vor dem Start einer KI-Konferenz in Berlin",
      },
      {
        slug: "macher-festival",
        title: "Macher Festival",
        text: "Hinter den Kulissen eines Festivals für tausende junge Macher",
      },
      {
        slug: "tech-europe-hackathon",
        title: "Tech Europe Hackathon",
        text: "Zwei Gründer, ein Hackathon: von der ersten Idee bis zum Pitch",
      },
    ],
    all: "Alle Arbeiten ansehen",
  },
  faqTitle: "Fragen",
  faq: [
    {
      question: "Wer produziert Gründer-Dokus in Deutschland?",
      answer:
        "Chris Mongang ist ein Filmemacher aus Berlin, der sich auf Dokumentarfilme über Startup-Gründer spezialisiert hat. Er hat mit Gründern in Berlin, Bonn, New York und Pittsburgh gedreht.",
    },
    {
      question: "Was unterscheidet eine Gründer-Doku von einem Imagefilm?",
      answer:
        "Ein Imagefilm folgt einem Drehbuch und zeigt das Unternehmen so, wie das Marketing es sehen möchte. Eine Gründer-Doku begleitet echte Tage und lässt auch das Unperfekte drin. Deshalb vertrauen Menschen ihr.",
    },
    {
      question: "Wie lange dauert das?",
      answer:
        "Ein Pilot braucht 1–2 Drehtage. Film und Clips bekommt ihr innerhalb von zwei Wochen.",
    },
    {
      question: "Können wir den Film auf YouTube und LinkedIn nutzen?",
      answer: "Ja. Ihr könnt alles auf allen euren Kanälen nutzen.",
    },
    {
      question: "Wie viel Zeit kostet uns das?",
      answer:
        "Fast keine. Ich begleite euren Tag – dazu kommt höchstens ein Interview von etwa einer Stunde.",
    },
    {
      question: "Was ist mit vertraulicher Technik?",
      answer:
        "Eine Vertraulichkeitsvereinbarung ist Standard. Nichts wird ohne eure Freigabe veröffentlicht.",
    },
  ],
  facts: {
    label: "Kurz gesagt",
    text: "Chris Mongang ist Dokumentarfilmer aus Berlin. Er produziert Gründer-Dokus: kurze Filme, die Startup-Gründer und ihre Teams durch echte Arbeitstage begleiten – für Recruiting, Fundraising und Launches. Er hat mit den Gründern von Starlife, Cortea, Pliant, Plancraft, Aniva Health, Bonn Open und Tech Europe gedreht und für den Gründer-Podcast Unicorn Bakery das Format „Day with“ entwickelt. Er arbeitet in Deutschland, im gesamten DACH-Raum, in Europa und in New York.",
  },
  closing: "Ihr wollt eine Doku über euer Unternehmen?",
  cta: "Gespräch buchen",
  otherLanguage: { text: "This page in English", path: servicePath },
};

export const notFound = {
  title: "Page not found",
  text: "This page doesn't exist.",
  home: "Back to the start page",
} as const;

export const caseStudyCopy = {
  back: "Work",
  company: "The company",
  moment: "The moment",
  whatWeDid: "What we did",
  delivered: "Delivered",
  cta: "Want this for your team?",
  more: "How a founder documentary works",
} as const;

export const aboutPage = {
  eyebrow: "About",
  title: "Chris Mongang",
  intro: [
    "I make documentaries about founders and the people building tomorrow – the real day-to-day, not the PR version.",
    "Before I picked up the camera for other people's stories, I built my own: a sneaker brand, a street-football event and media brand, and videos for my own channels. I know how much of building never makes it to the outside.",
  ],
  location: "Berlin · New York",
  serviceLink: "How a founder documentary works",
  chapters: {
    now: {
      label: "Now",
      title: "Founder documentaries",
      text: [
        "Based in Berlin, I spent more than a year producing documentary content for Unicorn Bakery, Fabian Tausch's founder podcast. There I developed \"Day with\" – a format that spends a day behind the scenes with founders from Plancraft, Pliant, Bonn Open, Cortea and the Macher Festival.",
        "In April 2026, a vacation in New York turned into my first multi-day documentary: Starlife, a humanoid robotics startup, filmed with its founders and investors in New York and Pittsburgh.",
        "Today I work independently with founders and their teams. Next step: telling their stories over months, not just days.",
      ],
    },
    building: {
      label: "2025 – 2026",
      title: "Building software",
      text: [
        "Alongside the camera, I taught myself to build products. First AngebotNow, an AI tool that turns a few photos into a finished quote for tradespeople, tested with a small group of craftsmen. Then the AfroLink Cup 2026 at BMW Park Munich: I built the entire tournament system – live scores, tables and news on the arena's giant screens, plus a fan app with predictions and MVP voting – and ran it from my laptop at the side of the pitch, in front of 4,500 people.",
        "Shipping something thousands of people watch live, with no second take, taught me what founders feel on launch day.",
      ],
      link: {
        text: "AfroLink Cup 2026",
        href: "https://afro-link.de/cup-2026",
      },
    },
    v2v: {
      label: "2024 – 2025",
      title: "V2V Club",
      text: [
        "V2V Club was my heart project: a street-football event and media brand. We hosted ten 1v1 tournaments across Germany and took the format into the youth academies of top German clubs with the Academy 1v1 Series.",
        "I was the host and moderator, with a camera crew of three to five people around me, and edited a good part of the videos myself. What I loved most was bringing great people together, playing football, having fun – and getting real emotions out of people that turned into videos worth watching.",
      ],
      facts: [
        { text: "30M+ organic views" },
        { text: "1.5M+ likes" },
        {
          text: "Featured on Oberpfalz TV",
          href: "https://www.youtube.com/watch?v=ttPFPCujXtc",
        },
        { text: "Partners: Prematch, DRILLS, MysteryPacks" },
      ],
      youtube: "Watch V2V Club on YouTube",
    },
    sneakers: {
      label: "2023 – 2025",
      title: "Ropez4u",
      text: [
        "Before that, I bootstrapped Ropez4u, a custom sneaker brand, mostly through organic content: 42,000+ followers on Instagram and TikTok, 10M+ views, and partner shops across Germany and Switzerland.",
      ],
    },
    boxing: {
      label: "Outside of work",
      title: "Boxing",
      text: [
        "I box several times a week and I'm currently preparing for my first fight.",
      ],
    },
  },
  closing: "Building something with a story worth sharing? I'd love to hear it.",
} as const;

export const linkedinUrl = "https://www.linkedin.com/in/chris-mongang";
export const instagramUrl = "https://www.instagram.com/chrismongang/";
export const xUrl = "https://x.com/chris_mongang";
export const v2vYoutubeUrl = "https://www.youtube.com/@v2v-club/videos";
