export type Person = {
  name: string;
  linkedin: string;
};

export type Project = {
  id: string;
  company: string;
  people: Person[];
  playbackId: string;
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
