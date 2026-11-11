// Texts for /imprint and /privacy. Each line of a section is its own paragraph;
// "\n" inside a line starts a new line without a gap (used for the address).

export type LegalPage = {
  title: string;
  sections: { heading: string; lines: string[] }[];
};

const name = "Chris Mongang";
const address = `${name}\nBirkenstraße 10b\n90596 Schwanstetten\nGermany`;
const email = "chrismongang5@gmail.com";

export const imprintPath = "/imprint";
export const privacyPath = "/privacy";

export const imprint: LegalPage = {
  title: "Imprint",
  sections: [
    {
      heading: "Information according to § 5 DDG",
      lines: [address],
    },
    {
      heading: "Contact",
      lines: [`Email: ${email}`],
    },
    {
      heading: "VAT ID",
      lines: [
        "VAT identification number according to § 27a of the German VAT Act: DE451598451",
      ],
    },
    {
      heading: "Responsible for the content according to § 18 (2) MStV",
      lines: [`${name}, address as above`],
    },
    {
      heading: "Consumer dispute resolution",
      lines: [
        "I am neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
      ],
    },
  ],
};

export const privacy: LegalPage = {
  title: "Privacy",
  sections: [
    {
      heading: "Who is responsible",
      lines: [
        address,
        `Email: ${email}`,
        "This page explains which personal data this website processes, why, and which rights you have.",
      ],
    },
    {
      heading: "Hosting",
      lines: [
        "This website is hosted by Vercel Inc., USA. When you open a page, Vercel processes technical data that your browser sends, such as your IP address, the page requested, date and time, and browser type. This is needed to deliver the website and keep it secure (Art. 6 (1) (f) GDPR).",
        "Data may be processed in the USA. Transfers are covered by the EU standard contractual clauses and, where applicable, the EU-U.S. Data Privacy Framework.",
      ],
    },
    {
      heading: "Visitor statistics",
      lines: [
        "I use Vercel Web Analytics to see which pages are visited. It works without cookies and does not identify individual visitors; I only see aggregated numbers (Art. 6 (1) (f) GDPR).",
      ],
    },
    {
      heading: "Fonts",
      lines: [
        "The typeface is loaded from Fontshare, a service of Indian Type Foundry. Your browser connects to their servers and transmits your IP address in the process (Art. 6 (1) (f) GDPR).",
      ],
    },
    {
      heading: "Videos",
      lines: [
        "Videos on this website are streamed by Mux, Inc., USA. When a video loads, your browser connects to Mux, which processes your IP address and playback data (Art. 6 (1) (f) GDPR).",
        "Some films are embedded from YouTube (Google Ireland Limited) in privacy-enhanced mode. A connection to YouTube is only made once you press play.",
      ],
    },
    {
      heading: "The form “Tell me about your startup”",
      lines: [
        "When you send the form, I receive what you enter: company, website, stage, what the film should do for you, your timing, your name, email address, optionally your WhatsApp number, and how you would like to be contacted.",
        "I use this only to answer your inquiry and prepare a possible project (Art. 6 (1) (b) GDPR). There is no newsletter and I do not pass your data on for advertising.",
        "The answers are delivered and stored through Resend, Inc., USA (email delivery and contact list) and Google Ireland Limited (a Google Sheets table). Both act as processors on my behalf. If you choose WhatsApp as your contact channel, I will write to you there; WhatsApp's own privacy terms then apply.",
        "I delete your inquiry once it is settled, at the latest twelve months after our last contact, unless we work together or the law requires me to keep it longer. You can ask me to delete it at any time.",
      ],
    },
    {
      heading: "Booking a call",
      lines: [
        "The calendar on the page “Book a call” is provided by Cal.com, Inc., USA. When the page loads, your browser connects to Cal.com. If you book a call, Cal.com processes your name, email address and the chosen time so the appointment can take place (Art. 6 (1) (b) GDPR).",
      ],
    },
    {
      heading: "Links to other websites",
      lines: [
        "Links to LinkedIn, X and Instagram are plain links. No data is sent to these services until you click them.",
      ],
    },
    {
      heading: "Your rights",
      lines: [
        "You have the right to access your data, to have it corrected or deleted, to restrict its processing, to receive it in a portable format, and to object to processing that is based on legitimate interests (Art. 15–21 GDPR). To use any of these rights, an email is enough.",
        "You also have the right to complain to a data protection supervisory authority, for example the one where you live.",
      ],
    },
    {
      heading: "Last updated",
      lines: ["November 2026"],
    },
  ],
};
