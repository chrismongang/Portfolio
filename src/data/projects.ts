export type Person = {
  name: string;
  linkedin: string;
};

export type CaseStudy = {
  slug: string;
  youtubeId: string;
  location?: string;
  paragraphs: string[];
};

export type Project = {
  id: string;
  company: string;
  people: Person[];
  playbackId: string;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    id: "pliant",
    company: "Pliant",
    playbackId: "Vejw4AvMFq6TypiWPoKa8YNWKM1Ltf2Wo029fm1ZsKyg",
    people: [
      { name: "Malte Rau", linkedin: "https://www.linkedin.com/in/malterau" },
    ],
  },
  {
    id: "bonn-open",
    company: "Bonn Open",
    playbackId: "mgn00v6tQb2MC6OIuvIWWT7XeATDhXtwVpk00jl5chXk8",
    people: [
      {
        name: "André Christ",
        linkedin: "https://www.linkedin.com/in/andrechrist",
      },
    ],
    caseStudy: {
      slug: "bonn-open",
      youtubeId: "Gn5wdPP4sfo",
      location: "Bonn",
      paragraphs: [
        "André Christ hat LeanIX an SAP verkauft und ist danach nicht in die Auszeit gegangen, sondern in die Bonn Open. Der Film fragt, was ihn dazu bringt, direkt das nächste große Projekt zu machen.",
        "Ich habe ihn dort begleitet, für das Format „Day with“ von Unicorn Bakery. Interviews mit Dominic Thiem, Mona Neubaur und Romy Kölzer erzählen die Zeit nach der Karriere, und was Unternehmertum und Leistungssport gemeinsam haben. Es geht darum, wie es wirklich aussieht, ein Turnier dieser Größe zu organisieren.",
      ],
    },
  },
  {
    id: "tech-europe",
    company: "Tech Europe",
    playbackId: "2rgFjSlsR12jsFFh8FLaMhAnSunRnrJbiy578EyOxfU",
    people: [
      {
        name: "Bela Wiertz",
        linkedin: "https://www.linkedin.com/in/bela-wiertz",
      },
    ],
    caseStudy: {
      slug: "tech-europe",
      youtubeId: "Rl6PRkdeKC0",
      location: "Berlin",
      paragraphs: [
        "Bela und das Team wollten die Konferenz bauen, die dem Ökosystem gefehlt hat: ein Ort für die Leute, die KI in die Anwendung bringen. Technisch, mit denen, die am aktuellen Stand arbeiten. Sie haben bei null angefangen. Wer spricht, wer Partner wird, welches Publikum zusammengehört. Dazu Venue, Marketing und Gespräche mit Partnern.",
        "Ich habe Bela und das Team vor und während der Konferenz begleitet. Der Film setzt 24 Stunden vor dem Öffnen der Türen ein und zeigt, wie es wirklich aussieht, ein Event dieser Größe zu organisieren.",
      ],
    },
  },
  {
    id: "aniva",
    company: "Aniva",
    playbackId: "ywzNselDJsRZQVLAEzizSUipX6wTysDlM008j00MP4IHU",
    people: [
      { name: "Jan Hecker", linkedin: "https://www.linkedin.com/in/janhecker" },
      {
        name: "Noah Petermann",
        linkedin: "https://www.linkedin.com/in/noahpetermann",
      },
    ],
  },
  {
    id: "protocol-health",
    company: "Stealth",
    playbackId: "mRq37hzdjogE6JWCdfczgOSbhbh44Q6t02axEtvU4sm4",
    people: [
      {
        name: "Franz Purucker",
        linkedin: "https://www.linkedin.com/in/franz-purucker",
      },
    ],
    caseStudy: {
      slug: "franz-purucker",
      youtubeId: "yGdKoWTleFg",
      location: "New York",
      paragraphs: [
        "Ich habe Franz eng begleitet, während er in New York für Research war. Über die Tage habe ich ihm viele Fragen gestellt und daraus die Storyline gebaut, dazu Interviews mit Investoren und Bekannten von ihm. Es ging darum, diese Zeit mitzugehen und so viele authentische Momente wie möglich festzuhalten. Das ist gelungen, im Material und in den Gesprächen.",
        "Sein Startup ist noch im Stealth. Er baut ein Werkzeug, das Menschen helfen soll, ihre Gewohnheiten zu verändern und ein gesünderes Leben zu führen. Diese Geschichte erzählt die Mini-Doku.",
      ],
    },
  },
  {
    id: "cortea",
    company: "Cortea",
    playbackId: "eA5yK02AUpelEXBa9ZIQt58qahaa01j5cDl6UqvFX93a8",
    people: [
      {
        name: "Valentin Neumann",
        linkedin: "https://www.linkedin.com/in/valentinneumann",
      },
      {
        name: "Philipp Hövelmann",
        linkedin: "https://www.linkedin.com/in/philipp-hoevelmann",
      },
    ],
    caseStudy: {
      slug: "cortea",
      youtubeId: "qiBnmScpjHY",
      paragraphs: [
        "Valentin Neumann und Philipp Hövelmann bauen Cortea. Der Film bleibt bei den beiden Gründern.",
        "Ich habe sie begleitet, für das Format „Day with“ von Unicorn Bakery. Ein Blick hinter die Kulissen: wie dieses AI-Startup tatsächlich entsteht.",
      ],
    },
  },
  {
    id: "tokura",
    company: "Tokura",
    playbackId: "Yi02oLnIHgLso2z5bHVsX0037gLkAFGkOpfaci23Hpxus",
    people: [
      {
        name: "Dr. Daniel Kreter",
        linkedin: "https://www.linkedin.com/in/danielkreter",
      },
    ],
  },
  {
    id: "mitte",
    company: "Mitte",
    playbackId: "yqy97ClB9L700RaJyawTKWkx700ZOvh9BGsBTplWqq007U",
    people: [
      {
        name: "Bastian Krautwald",
        linkedin: "https://www.linkedin.com/in/bastian-krautwald",
      },
    ],
  },
  {
    id: "plancraft",
    company: "Plancraft",
    playbackId: "jU73EbFmxPRdW01UixB5L4idE92c00D4YcyVeFXlqtmu8",
    people: [
      {
        name: "Julian Wiedenhaus",
        linkedin: "https://www.linkedin.com/in/julianwiedenhaus",
      },
    ],
  },
  {
    id: "remi-health",
    company: "Remi Health",
    playbackId: "wM3PqHepLNsnEqC8Evc1Hw02Mra0265j7oyYjdgj024DI00",
    people: [
      {
        name: "Anthony Bielenstein",
        linkedin: "https://www.linkedin.com/in/anthony-bielenstein",
      },
    ],
  },
];
