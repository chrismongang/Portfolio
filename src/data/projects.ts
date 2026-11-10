export type Person = {
  name: string;
  linkedin: string;
};

export type CaseStudy = {
  slug: string;
  /** Text for search results and link previews. Falls back to the first paragraph. */
  description?: string;
  /** Link preview image in /public, ideally 1200×630. Falls back to a Mux still. */
  ogImage?: string;
  youtubeId?: string;
  muxPlaybackId?: string;
  location?: string;
  /** What the company does. Text may contain [links](https://…). */
  company: string;
  /** Why this was the right time to film. */
  moment: string;
  whatWeDid: string;
  /** Only for films that have actually been handed over. */
  delivered?: string;
  quote?: { text: string; author: string };
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
    id: "tech-europe-hackathon",
    company: "Tech Europe Hackathon",
    playbackId: "NxtM1yBrfoc01x7n4NdaL00VSZ9i2dnBEGjko4ZU2K2bo",
    people: [
      {
        name: "Vitor Fernandez",
        linkedin: "https://www.linkedin.com/in/vf-castro",
      },
      {
        name: "Elia Hilse",
        linkedin: "https://www.linkedin.com/in/eliahilse",
      },
    ],
    caseStudy: {
      slug: "tech-europe-hackathon",
      muxPlaybackId: "NxtM1yBrfoc01x7n4NdaL00VSZ9i2dnBEGjko4ZU2K2bo",
      company:
        "Vitor and Elia built [SCP](https://scp.dev/) at the Tech Europe Hackathon – a message layer that lets coding agents across tools like Claude Code and Codex talk to each other.",
      moment:
        "One hackathon: an idea, a few hours to build it and a pitch in front of the judges. Whether they won is revealed in the documentary.",
      whatWeDid:
        "I followed Vitor and Elia through the hackathon, from the first idea to the final pitch, to tell their story up close.",
      delivered: "Teaser – the full documentary is in post-production",
    },
  },
  {
    id: "macher-festival",
    company: "Macher Festival",
    playbackId: "8EqA2g3pcLEtuTBzQALVZTHk2XCSzTwZN2h3OhVzC88",
    people: [
      {
        name: "Daniel Michailidis",
        linkedin: "https://www.linkedin.com/in/daniel-michailidis-9a76a3123",
      },
    ],
    caseStudy: {
      slug: "macher-festival",
      youtubeId: "iFKOEHKQZao",
      location: "Ferropolis",
      company:
        "[Macher Festival](https://www.macherfestival.io/), a hands-on festival where thousands of young people build vehicles, learn crafts and try out ideas – led by managing director Daniel Michailidis.",
      moment:
        "Festival days – when months of planning have to work in real time.",
      whatWeDid:
        "I followed Daniel for Unicorn Bakery’s “Day with” format: what it really takes behind the scenes to run the festival.",
      delivered: "“Day with” episode for Unicorn Bakery",
    },
  },
  {
    id: "aniva-health",
    company: "Aniva Health",
    playbackId: "Qsxxyows6HHSO00vjx3O5TsKs7RzLkGZHi2vQn01FJ2mc",
    people: [
      {
        name: "Jan Hecker",
        linkedin: "https://www.linkedin.com/in/janhecker",
      },
      {
        name: "Noah Petermann",
        linkedin: "https://www.linkedin.com/in/noahpetermann",
      },
    ],
  },
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
      company:
        "Bonn Open, a tennis tournament built by André Christ after he sold LeanIX to SAP.",
      moment:
        "Tournament week. Instead of taking time off after the exit, André went straight into the next big project.",
      whatWeDid:
        "A “Day with” for Unicorn Bakery, with interviews with Dominic Thiem, Mona Neubaur and Romy Kölzer – on life after a career, and what entrepreneurship and elite sport have in common.",
      delivered: "“Day with” episode for Unicorn Bakery",
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
      company:
        "Tech Europe, a conference for the people bringing AI into real-world use – technical, with the ones working at the cutting edge.",
      moment:
        "The 24 hours before the doors open. Built from zero: speakers, partners, audience, venue and marketing.",
      whatWeDid:
        "I followed Bela and the team before and during the conference – what it really looks like to put on an event of this size.",
      delivered: "Event documentary",
    },
  },
  {
    id: "starlife",
    company: "Starlife",
    playbackId: "H9vNKjUDo00rT02CAL5bRUdX3TCb00IhYNVV8VBBeti01fc",
    people: [
      {
        name: "Leander Maerkisch",
        linkedin: "https://www.linkedin.com/in/leandermaerkisch/",
      },
    ],
    caseStudy: {
      slug: "starlife",
      description:
        "With Leander Maerkisch in New York and Pittsburgh: in the office, in clinics and with investors. A documentary about Starlife and robots that make physical work possible remotely.",
      ogImage: "/og/starlife.jpg",
      muxPlaybackId: "H9vNKjUDo00rT02CAL5bRUdX3TCb00IhYNVV8VBBeti01fc",
      location: "New York",
      company:
        "Starlife builds humanoid robots that make physical work possible remotely.",
      moment:
        "First deployments in clinics, conversations with investors and an event in Pittsburgh.",
      whatWeDid:
        "5 days in New York and Pittsburgh: in the office, in the workshop with co-founder and CTO [Satrajit Chatterjee](https://www.linkedin.com/in/satrajit-chatterjee/), in the clinics where the robots are deployed, and with investors [Mike Mahlkow](https://www.linkedin.com/in/mikemahlkow/) and [Paige Craig](https://www.linkedin.com/in/paigecraig/). It started as a vacation: [Fabian Tausch](https://www.linkedin.com/in/fabian-tausch/) connected me with Mike, who called a few founders the same day. Leander was the first to reply – we started filming the next morning.",
      quote: {
        text: "Holy sh*t! And that's only the teaser? Where's the Oscar?",
        author: "Leander Maerkisch, Co-Founder & CEO, Starlife",
      },
    },
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
      muxPlaybackId: "lXLwtv5BW02rSEkxtypR3pP1EN01FAK01L4T6ap9SD9NY8",
      location: "New York",
      company:
        "A stealth startup building a tool that helps people change their habits and live healthier lives. Franz even got certified as a personal trainer to understand his customers better.",
      moment:
        "A research trip to New York - the early phase, before the product goes public.",
      whatWeDid:
        "I followed Franz closely in New York and asked him a lot of questions along the way. I also interviewed investors and people who know him: [Jubin Gorji](https://www.linkedin.com/in/jubingorji/), [Mike Mahlkow](https://www.linkedin.com/in/mikemahlkow/), [Maxime Kantenwein](https://www.linkedin.com/in/maximekantenwein/) and [Greg Alba](https://www.linkedin.com/in/greg-pz/). The goal: capture as many authentic moments of this phase as possible.",
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
      company:
        "[Cortea](https://www.cortea.ai/) builds AI agents for audits – used by firms like Forvis Mazars and KPMG.",
      moment:
        "The day-to-day of building an AI startup – the film stays with the two founders.",
      whatWeDid:
        "A “Day with” for Unicorn Bakery: a look behind the scenes at how this AI startup actually gets built.",
      delivered: "“Day with” episode for Unicorn Bakery",
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
