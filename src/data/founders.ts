export type Founder = {
  name: string;
  venture: string;
};

export const founders: Founder[] = [
  { name: "Fabian Tausch", venture: "Unicorn Bakery" },
  { name: "Daniel Ulman", venture: "Unicorn Bakery" },
  { name: "Andre Christ", venture: "Bonn Open" },
  { name: "Valentin Neumann & Philipp Hövelmann", venture: "Cortea" },
  { name: "Julian Wiedenhaus", venture: "Plancraft" },
  { name: "Bela Wirtz", venture: "Tech Europe" },
  { name: "Franz Purucker", venture: "Protocol Health" },
  { name: "Leander Maerkisch", venture: "Starlife" },
  { name: "Mike Mahlkow", venture: "Angel Investor" },
  { name: "Alexander Pfahl", venture: "Influencer" },
  { name: "Mattia Schaper", venture: "SDRs of Germany" },
  { name: "Bastian Krautwald", venture: "Mitte Padel" },
  { name: "Jan Hecker & Noah Petermann", venture: "Aniva Health" },
  { name: "Dr. Daniel Kreter", venture: "Tokura" },
  { name: "Anthony Bielenstein", venture: "Remi Health" },
];

export const ventures = [...new Set(founders.map((f) => f.venture))];
