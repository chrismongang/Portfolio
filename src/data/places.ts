export type Place = {
  name: string;
  lon: number;
  lat: number;
  /** Where Chris lives and works from. */
  base?: boolean;
  /** Available for projects here, outside the shaded countries. */
  available?: boolean;
};

/** Places where Chris has filmed, most important first (labels are placed in this order). */
export const places: Place[] = [
  { name: "Berlin", lon: 13.405, lat: 52.52, base: true },
  { name: "New York", lon: -74.006, lat: 40.7128, available: true },
  { name: "Bonn", lon: 7.0982, lat: 50.7374 },
  { name: "Pittsburgh", lon: -79.9959, lat: 40.4406 },
  { name: "Ferropolis", lon: 12.4486, lat: 51.7603 },
];

// Countries by their ISO 3166-1 numeric code, as used in the map data.

/** Germany, Austria, Switzerland. */
export const dachCountries = new Set(["276", "040", "756"]);

/** The rest of Europe that is shaded as "available". */
export const europeCountries = new Set([
  "008", // Albania
  "056", // Belgium
  "070", // Bosnia and Herzegovina
  "100", // Bulgaria
  "191", // Croatia
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
  "807", // North Macedonia
  "826", // United Kingdom
]);

/** Shaded too, but without a numeric code in the map data. */
export const europeCountryNames = new Set(["Kosovo"]);
