# Sputnik S Tracker

A static page that shows the status and, once it is in orbit, the live position of the reported Russian satellite **Sputnik S** on a 3D globe.

Until orbital data exists the page shows a *coming soon* banner, the reported launch window, the likely launch sites (Plesetsk, Baikonur) and a timeline of reports.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) (three.js) for the globe, lazy-loaded
- [satellite.js](https://github.com/shashwatak/satellite-js) for SGP4 propagation in the browser
- Orbital elements (TLE) from [CelesTrak](https://celestrak.org), fetched client-side (CORS enabled, no key needed)

## Updating the mission data

All mission info lives in [`public/data/sputnik-s.json`](public/data/sputnik-s.json). The page re-reads it every 10 minutes, so a commit to `main` is enough; no code change needed.

Once the satellite is catalogued (it will most likely be named `Kosmos-XXXX`):

```json
{
  "status": "tracking",
  "noradId": 12345,
  "designation": "Kosmos-XXXX"
}
```

The page then pulls the latest TLE from CelesTrak every 2 hours and recomputes the position every second. If CelesTrak has nothing, you can paste elements manually with `"tle": ["1 …", "2 …"]`.

Status values: `awaiting-launch`, `launched`, `tracking`, `decayed`.

## Development

```bash
npm install
npm run dev
npm run build   # outputs to dist/
```

## Deployment

`.github/workflows/deploy.yml` builds on every PR and deploys `main` to GitHub Pages.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
