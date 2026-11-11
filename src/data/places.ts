export type Place = {
  name: string;
  /** German name, where it differs. */
  nameDe?: string;
  lon: number;
  lat: number;
  /** Where Chris lives and works from. */
  base?: boolean;
};

/**
 * Places where Chris has filmed, sorted by how relevant they are for his
 * clients: Berlin and New York first, then the startup cities. The text
 * below the globe lists them in this order, and it decides which names are
 * shown first where there is not enough room on the globe for all of them.
 */
export const places: Place[] = [
  { name: "Berlin", lon: 13.405, lat: 52.52, base: true },
  { name: "New York", lon: -74.006, lat: 40.7128 },
  { name: "Munich", nameDe: "München", lon: 11.582, lat: 48.1351 },
  { name: "Zurich", nameDe: "Zürich", lon: 8.5417, lat: 47.3769 },
  { name: "Hamburg", lon: 9.9937, lat: 53.5511 },
  { name: "London", lon: -0.1278, lat: 51.5074 },
  { name: "Vienna", nameDe: "Wien", lon: 16.3738, lat: 48.2082 },
  { name: "Cologne", nameDe: "Köln", lon: 6.9603, lat: 50.9375 },
  { name: "Frankfurt", lon: 8.6821, lat: 50.1109 },
  { name: "Düsseldorf", lon: 6.7735, lat: 51.2277 },
  { name: "Stuttgart", lon: 9.1829, lat: 48.7758 },
  { name: "Boston", lon: -71.0589, lat: 42.3601 },
  { name: "Barcelona", lon: 2.1686, lat: 41.3874 },
  { name: "Basel", lon: 7.5886, lat: 47.5596 },
  { name: "Nuremberg", nameDe: "Nürnberg", lon: 11.0767, lat: 49.4521 },
  { name: "Mannheim", lon: 8.466, lat: 49.4875 },
  { name: "Bonn", lon: 7.0982, lat: 50.7374 },
  { name: "Vilnius", lon: 25.2797, lat: 54.6872 },
  { name: "Pittsburgh", lon: -79.9959, lat: 40.4406 },
  { name: "Marseille", lon: 5.3698, lat: 43.2965 },
  { name: "Monaco", lon: 7.4246, lat: 43.7384 },
  { name: "Palermo", lon: 13.3615, lat: 38.1157 },
  { name: "Mallorca", lon: 2.6502, lat: 39.5696 },
  { name: "Marbella", lon: -4.8824, lat: 36.5101 },
  { name: "Zadar", lon: 15.2314, lat: 44.1194 },
  { name: "Paphos", lon: 32.4245, lat: 34.7754 },
  { name: "South Tyrol", nameDe: "Südtirol", lon: 11.3548, lat: 46.4983 },
  { name: "Bamberg", lon: 10.9028, lat: 49.8988 },
  { name: "Offenburg", lon: 7.9498, lat: 48.4731 },
  { name: "Ferropolis", lon: 12.4486, lat: 51.7603 },
  { name: "Santiago de Compostela", lon: -8.5448, lat: 42.8782 },
  { name: "Fisterra", lon: -9.264, lat: 42.905 },
];

// Countries by their ISO 3166-1 numeric code, as used in the map data.

/** Home country, filled in light blue. */
export const homeCountries = new Set(["276"]); // Germany

/** Countries where Chris is available, filled in mint. */
export const availableCountries = new Set([
  "008", // Albania
  "040", // Austria
  "056", // Belgium
  "070", // Bosnia and Herzegovina
  "100", // Bulgaria
  "191", // Croatia
  "196", // Cyprus
  "203", // Czechia
  "208", // Denmark
  "233", // Estonia
  "246", // Finland
  "250", // France
  "300", // Greece
  "348", // Hungary
  "352", // Iceland
  "372", // Ireland
  "380", // Italy
  "428", // Latvia
  "440", // Lithuania
  "442", // Luxembourg
  "499", // Montenegro
  "528", // Netherlands
  "578", // Norway
  "616", // Poland
  "620", // Portugal
  "642", // Romania
  "688", // Serbia
  "703", // Slovakia
  "705", // Slovenia
  "724", // Spain
  "752", // Sweden
  "756", // Switzerland
  "807", // North Macedonia
  "826", // United Kingdom
  "840", // United States
]);

/** Filled in mint too, but without a numeric code in the map data. */
export const availableCountryNames = new Set(["Kosovo"]);

/** Countries with far-away territories that should not be filled along with them. */
export const mainlandOnly = new Set(["250"]); // France without French Guiana
