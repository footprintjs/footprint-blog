# footprint-blog

The footprintjs ecosystem blog — **one source, two lenses**: every post renders as a
detailed **Read** article (SEO-first) and as an animated **Watch** deck, from the same content.
It dogfoods the flowchart pattern: one canonical record, you choose the lens.

> Status: **work in progress** (not yet deployed).

## Structure

```
storydeck/     ← internal dual-view engine (reusable; extract to a package when matured)
                 PostView · BlogView · SlideDeck · SlideFigure · ThemeToggle · scopeDeckCss
content/       ← the posts (single source): deck-data.json + flowchart.js
app/           ← thin Next.js routes that mount storydeck
components/    ← consumer chrome (Header, Footer)
public/        ← deck-stage.js runtime + brand assets
```

`storydeck/` is deliberately an **internal folder** for now — a clean boundary we can lift into
its own package (`@footprintjs/storydeck`) once it's proven. See `PROPOSAL-platform.md`.

## Develop

```bash
npm install
npm run dev     # http://localhost:8830/blog
```

Light/dark theme (the slides theme too). Read ⇄ Watch toggle on each post (`?view=slides`).

## License

MIT © [Sanjay Krishna Anbalagan](https://github.com/sanjay1909)
