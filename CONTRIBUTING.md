# Contributing

Thanks for helping out! There are two main ways to contribute.

## 1. Mission updates (no coding needed)

The page's content comes from [`public/data/sputnik-s.json`](public/data/sputnik-s.json). Useful updates include:

- a confirmed launch date or launch
- the NORAD catalog number and official designation (likely `Kosmos-XXXX`)
- significant, credible news for the timeline

Rules for mission data:

- **Every timeline entry needs a source** (`source.label` and `source.url`) from a reputable outlet, an official statement, or an established tracking community.
- Write titles neutrally and say "reportedly" when something is unconfirmed.
- Dates use `YYYY-MM-DD`, or `YYYY-MM` if only the month is known.
- Update `lastUpdated` to today's date.

If you don't want to open a PR, [file a mission update issue](https://github.com/mroxso/sputnik-s-tracker/issues/new?template=mission-update.yml) instead.

## 2. Code

1. Fork the repo and create a branch from `main`.
2. `npm install`, then `npm run dev`.
3. Make your change. Check it on a phone-sized viewport as well as desktop.
4. Run `npm run lint` and `npm run build`. Both must pass.
5. Open a PR describing what changed and why. Screenshots help for UI changes.

### Guidelines

- TypeScript, React function components and hooks.
- Style with Tailwind utility classes. Add UI primitives with `npx shadcn@latest add <component>` rather than writing them by hand.
- Keep the site static: no servers, no secrets, no API keys in the client.
- Keep heavy dependencies out of the initial bundle. The globe is lazy-loaded for that reason.

## Reporting bugs and ideas

Use the [issue templates](https://github.com/mroxso/sputnik-s-tracker/issues/new/choose). For security issues, see [SECURITY.md](SECURITY.md).

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).
