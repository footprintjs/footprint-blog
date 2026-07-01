# Proposal — the dual-view content platform (library) + footprintjs-blog (consumer)

> Status: **PROPOSAL for review** — not built. The current `footprint-blog` app is the working
> prototype; this proposal turns it into a reusable platform. Fixes shipped first: light/dark +
> a11y pass (done). Author: Sanjay Krishna Anbalagan · 2026-06-30

## 1. Why (two goals, one build)

1. **A reusable content platform.** "One source, two lenses" — write a piece once; render it as a
   **detailed, SEO-first blog** and as an **animated, progressive deck**. This is the footprintjs
   idea applied to content: one canonical record, you choose the lens. The blog *dogfoods the
   product*.
2. **Your technical identity.** These posts are how the wider world understands the ecosystem
   *and* how they discover **you** — the inventor. So the platform treats **authorship + SEO as
   first-class**: every post is unmistakably yours, structured for search, and built to compound
   into a body of work you can point a hiring market at.

Platform-engineer stance: build the **capability once** as a library with a clean boundary;
`footprintjs-blog` is merely its **first consumer**. Other consumers later (an agentfootprint
blog, docs "explainers", conference decks) reuse the same engine.

## 2. The boundary — library vs consumer

```
┌─ @footprintjs/storydeck  (the platform — reusable) ──────────────────┐
│  content model     Post · Section · SlideStep (the single source)     │
│  renderers         <ReadView> · <WatchView> · <SlideFigure>           │
│  runtime           deck-stage integration (the slide engine)          │
│  theming           light/dark tokens + <ThemeToggle> + FOUC script    │
│  seo               buildArticleMetadata() · <BlogPostingJsonLd>        │
│                    OG-image renderer · rss() · sitemap()               │
│  import            importDeck(designProjectId|dcHtml) → post data      │
└──────────────────────────────────────────────────────────────────────┘
              ▲ consumes
┌─ footprintjs-blog  (a consumer app — Next.js) ───────────────────────┐
│  content/posts/**   the actual posts (MDX/JS + deck-data)             │
│  brand config       tokens, logo, author identity, nav                │
│  app/**             thin Next routes that mount the library           │
└──────────────────────────────────────────────────────────────────────┘
```

**Name (placeholder):** `@footprintjs/storydeck` (alt: `deckdown`, `dualview`). Ships as its own
package; the blog depends on it. (Naming for the common person, per convention — final call yours.)

## 3. The grouping feature (the concrete new capability)

**Problem today:** the blog renders *every* deck slide as its own figure. When several slides are
**progressive builds of one diagram**, the blog shows near-duplicate stills — it "looks like a
slide render of each slide," not an article.

**Model:** the unit is a **Section**. A Section owns **1..N SlideSteps** (the progressive builds)
plus one authored `body`.

```
Section = {
  heading,                 // real text (SEO + screen readers)
  steps: [html, html, …],  // the progressive-build slides (1 = a plain slide; N = a group)
  body,                    // the detailed blog prose (authored once)
}
Post = { slug, title, description, date, author, tags, sections: [Section, …] }
```

- **Read view** → for each Section: `heading` + **one `SlideFigure` of the LAST step** (the fully
  composed diagram) + `body`. Intermediate build steps are *not* shown — no duplicates. Reads like
  an article: concept → one figure → detail.
- **Watch view** → plays **every step of every Section** in order — the full progressive deck.

So a Section is exactly *"one slide, or a group of slides."* One authoring model, both behaviors.

**How groups get defined (import convention):** deck slides carry `data-group="whiteboard"`; the
importer folds consecutive same-group slides into one Section (its steps = those slides; the blog
figure = the last). Slides with no `data-group` are their own single-step Section. Authors can
also override grouping in the post module. *(This post's 13 slides are already distinct concepts,
so they map 1:1 today — the feature matters the moment a post builds one diagram over several
slides.)*

## 4. Authoring workflow (scalable — "create more blogs like this")

1. Build a deck in **Claude Design** (add `data-group` on build-step slides).
2. `npx storydeck import <designProjectId> <slug>` → pulls the `.dc.html` via the Design MCP,
   extracts sections/steps + deck CSS → writes `content/posts/<slug>/deck-data.json`.
3. Write `content/posts/<slug>/post.(mdx|js)` — meta + per-Section `heading` + `body`.
4. It appears automatically (a registry globs `content/posts/**`; `generateStaticParams` covers
   all; RSS/sitemap/OG regenerate). **Adding a post = one folder.**

A post may also be **text-only** (a Section with no steps renders as prose) — so the platform
serves classic articles too, not only deck-backed ones.

## 5. SEO + personal brand (first-class)

- **Read view is canonical + server-rendered** (the crawlable surface). Watch is a client lens on
  the same URL (`?view=slides`) → zero duplicate content.
- **Authorship everywhere:** `BlogPosting` → `author` = Person *Sanjay Krishna Anbalagan* with
  `sameAs` (GitHub, LinkedIn, X, site) — the same identity graph as the org site, so search
  engines fuse "these posts + the ecosystem + this person." An `/blog/about` author page anchors it.
- **Per-post OG image** auto-rendered from the title slide (Satori at build) — no manual work.
- **RSS/Atom feed** (dev subscription = adoption) + auto **sitemap** + breadcrumbs + fast static
  pages + strong headings.
- **Content strategy for identity:** each post is a self-contained demonstration of expertise
  (the flowchart pattern, context-bug localization, agent observability…) — the compounding body
  of work that reads as *your* thing in the job market.

## 6. Tech

- **Next.js (App Router)** — SSR/SSG for SEO, static-export to Pages. **React** for the renderers
  and the theme/toggle. Build-time **Satori/next-og** for OG images. **deck-stage.js** as the
  slide runtime (already proven). Fonts via the brand tokens.
- Library ships framework-light where possible (content model + import are plain JS; renderers are
  React). Theming is CSS tokens + a tiny client toggle.

## 7. Migration (the prototype is ~80% there)

1. Lift the renderers/theming/SEO out of `footprint-blog` into `@footprintjs/storydeck` with a
   clean public API (`<ReadView>`, `<WatchView>`, `buildMetadata`, `<JsonLd>`, `importDeck`).
2. Introduce the **Section = steps[]** model + the **grouping** render rules.
3. Multi-post **registry** (`content/posts/**`) + the **import CLI**.
4. `footprintjs-blog` becomes a thin consumer that provides content + brand.
5. Repo + deploy: own `footprint-blog` repo → static-export → publish to `footprintjs.github.io/blog`;
   add **Blog** to the org nav; RSS + OG live.

## 8. Open decisions

1. **Package shape:** monorepo (`packages/storydeck` + `apps/blog`) vs a standalone package the
   blog installs. (Recommend monorepo — easiest to co-evolve.)
2. **Package name.**
3. **Authoring format:** MDX (rich, familiar) vs JS content modules (simplest). Recommend MDX for
   `body`, JS for structure.
4. **Deploy:** static-export into org `/blog` (Pages) vs Vercel (preview deploys + runtime OG).
5. **Publish the package to npm** (so it's a real, reusable, credited artifact) vs keep internal.

## 9. What ships when you approve

Phase A (engine): registry + `Section.steps[]` + grouping + import CLI, still in `footprint-blog`.
Phase B (extract): move engine into `@footprintjs/storydeck`; blog consumes it.
Phase C (ship): repo + deploy `/blog` + RSS + OG + author page + org nav link.
