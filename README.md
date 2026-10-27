# Chris Mongang

Persönliche Website für dokumentarische Videos mit Gründerinnen und Gründern.

Live-Seiten:

- `/` — Headline, CTAs, Logo-Slider
- `/work` — Portfolio-Raster mit Mux-Loops
- `/contact` — 15-Minuten-Gespräch über Cal.com

## Stack

- Vite, React 19, TypeScript, Tailwind CSS v4
- React Router
- [Mux](https://www.mux.com/) für Streaming (keine Rohvideos im Repo)
- [Cal.com](https://cal.com/) Embed

## Lokal starten

```bash
npm install
npm run dev
```

Weitere Scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Inhalte

Texte stehen in `src/copy.ts`. Portfolio-Clips und LinkedIn-Links in `src/data/projects.ts` (Mux Playback IDs). Logos in `public/logos/`.

Neue Videos nur als Mux-Playback-ID eintragen — keine 4K-Dateien committen.
