# footprintjs Blog — Spec (v1, draft)

> Status: **SPEC ONLY — not built.** Awaiting approval before any code.
> Author: Sanjay Krishna Anbalagan · Drafted 2026-06-29

## 1. Goal & principles

A content home for the footprintjs ecosystem that publishes each piece **once** and renders it
as **two lenses of the same source**:

- **Blog view** — detailed, sectioned, text-rich. The reading + **SEO** surface.
- **Slide view** — the same content as an **animated, progressive deck** (the "mental model").

Principles:
1. **One source, two views — zero duplication.** A post is authored once; both views are
   projections of it. (This is the footprintjs idea applied to content: *one canonical record,
   you choose the lens.* The blog dogfoods the product.)
2. **SEO-first for adoption.** The blog view is built to current standards so we get found.
3. **Scalable.** Adding a post = adding one file. Both views come for free.
4. **On-brand, own space.** Its own `/blog` area + nav entry, under the same brand shell.

## 2. The content model (the crux)

The unit is a **section**. A post = ordered list of sections. Each section carries the fields
each view needs — nothing is written twice:

| Field | Blog view | Slide view |
|---|---|---|
| `eyebrow` | small label | slide eyebrow |
| `headline` | section heading | slide headline |
| `caption` | — | the slide's one-line takeaway |
| `body` (MDX) | the detailed prose / code / links | — |
| `visual` (`id@step`) | rendered inline at its step | rendered + animated to its step |
| `steps` (optional) | shows final state | **one section → N slides** (progressive build) |

`caption` (terse takeaway) and `body` (deep explanation) are **complementary, not duplicates** —
a good post needs both, authored once each. The **visual is defined once** in a registry and
reused by both views (and the OG image) — the real anti-duplication win.

> A section can be **one slide** or **a group of slides** (via `steps`), but it is always **one
> blog section**. This matches "each slide is a section; a group of slides is a section."

### Authoring format (MDX)

```mdx
---
title: The Flowchart Pattern
slug: the-flowchart-pattern
description: How a whiteboard sketch becomes software that explains itself.
date: 2026-07-01
tags: [primer, flowchart-pattern]
cover: auto            # OG image auto-generated from the title slide
---

<Section
  eyebrow="IT STARTS ON A WHITEBOARD"
  headline="Every system begins as a drawing"
  caption="Boxes for steps. Arrows for what happens next."
  visual="flowchart@1"
>
The full prose for the **blog view** lives here — as long and detailed as needed, with
markdown, code, links. The slide view ignores this body and shows only the eyebrow /
headline / caption / visual. The blog view shows the headline + visual + this prose.
</Section>

<Section eyebrow="THE DRIFT" headline="The code stops looking like the drawing"
         caption="The map and the territory drift apart." visual="flowchart@4" steps={[2,3,4]}>
...detailed prose... (this section animates as 3 slides, builds 2→3→4, but is one blog section)
</Section>
```

## 3. The two renderers

- **Blog renderer** (`/blog/[slug]`): each section → `<h2>` headline + inline `<Visual step>` +
  the prose body. Standard article layout, TOC, prev/next, reading time.
- **Slide renderer** (`?view=slides`): sections → slides. Section with `steps` → one slide per
  step, sharing the heading, advancing the visual by one delta each. Keyboard/space nav,
  fragments, 16:9, full-screen. Progressive — only the new delta animates; prior content stays.
- **Toggle**: a "Read it ⇄ Watch it" control on one canonical URL. Preserves position — reading
  section 5 → Watch jumps to section 5's first slide (deep-linkable `?view=slides&s=5`).

## 4. Shared visuals (diagram primitives)

- A registry of reusable React components, each taking a `step` prop:
  `visuals = { flowchart: <Flowchart step/>, agentLoop: <AgentLoop step/>, ecosystem: <Ecosystem/> }`.
- `visual="flowchart@2"` → `<Flowchart step={2} />`. **Defined once**, used three ways: inline in
  blog, animated in slides, and rendered into the OG image.
- First primitive = the **flowchart-builder** that powers the primer (the growing diagram).

## 5. Routes & information architecture

```
/blog                      → index (cards: title, description, date, tags)
/blog/[slug]               → post, BLOG view (canonical)
/blog/[slug]?view=slides   → same post, SLIDE view (client toggle, not a new URL)
/blog/tag/[tag]            → (optional) tag archive
/blog/rss.xml              → feed
```
- Add **"Blog"** to the shared site header nav.
- Breadcrumbs: footprintjs › Blog › <post>.

## 6. SEO (to standard)

- **Blog view is canonical** (server-rendered text). Slides are a client toggle on the same URL
  → **no duplicate-content risk** (your "no duplication" instinct, paying off in SEO too).
- Per post: unique `<title>` + meta description; **JSON-LD `BlogPosting`** (headline, author =
  Sanjay Krishna Anbalagan, datePublished, image, publisher = footprintjs org — ties into the
  author/org graph already on the site); Open Graph + Twitter card.
- **OG image auto-generated** per post from its title slide (Satori / `next/og` at build) — no
  manual OG work, fully scalable.
- Blog index: **RSS/Atom feed** (dev subscription = adoption), `Blog` schema, auto **sitemap**,
  clean heading hierarchy, fast static pages, mobile.
- **Internal linking**: each post links to the relevant library/docs (topical authority — same
  cross-linking play used across the repos).

## 7. Tech stack

- **Next.js (App Router)** + **MDX** (Fumadocs MDX, to match agentfootprint docs — shared muscle)
  with a custom `<Section>` component.
- **Static export** (`output: export`) → deploys to GitHub Pages. OG images + RSS + sitemap
  generated at build.
- **Slides animation**: Framer Motion (`motion`) for the progressive deltas + a small step state
  machine + keyboard nav.
- **Brand**: shared design tokens (extract the org-site tokens into a small theme), shared foot
  logo + header/footer shell so it feels like one site.

## 8. Project structure (proposed)

```
footprint-blog/
  content/blog/*.mdx              # posts (one file = one post = both views)
  components/Section.tsx          # the dual-view unit
  components/blog/ slides/        # the two renderers
  visuals/                        # diagram primitives (step-parameterized)
  app/blog/page.tsx               # index
  app/blog/[slug]/page.tsx        # post (blog + slide toggle)
  lib/seo.ts  lib/og.tsx  lib/feed.ts  lib/sitemap.ts
  theme/tokens.css                # shared brand tokens
```

## 9. Deployment

- Recommended: build the app, **static-export**, publish the `out/` into the
  `footprintjs.github.io` repo under **`/blog/`** → clean URL `footprintjs.github.io/blog/` on the
  existing domain (org page stays at `/`). Blog source lives in its own `footprint-blog` repo; a
  publish step copies the export in. (Alt: Vercel for preview deploys + runtime OG — note it
  would move off the github.io domain unless a custom domain is added.)

## 10. Scalability & authoring

- A post is **data** (one MDX file). Author the spotlight attrs + the detail body per section;
  both views + the OG image + the feed entry are generated. No per-post page-building.
- New visuals are added once to the registry and reused across posts.

## 11. Phased build plan

- **P0** Scaffold Next.js app, brand tokens, shared header/footer + "Blog" nav link.
- **P1** Content model + `<Section>` + blog renderer (`/blog`, `/blog/[slug]`).
- **P2** Visual registry + the flowchart-builder primitive (step-parameterized).
- **P3** Slide renderer + Read⇄Watch toggle + keyboard nav + progressive builds.
- **P4** SEO: metadata, `BlogPosting` JSON-LD, OG image generation, RSS, sitemap, canonical.
- **P5** Author **Post #1 = "The Flowchart Pattern"** end-to-end (proves the dual-view).
- **P6** Deploy to `/blog`, add to org nav, polish (light/dark, mobile, perf, Lighthouse).

## 12. Open decisions

1. **Deploy target**: static-export-into-org-repo `/blog` (Pages) vs Vercel (previews + runtime OG).
2. **MDX lib**: Fumadocs MDX (consistency) vs Contentlayer/next-mdx-remote (lighter).
3. **Animation lib**: Framer Motion vs hand-rolled CSS/JS (lighter, less polish).
4. **Repo**: new `footprint-blog` repo vs a folder in the org repo.

## 13. Risks & mitigations

- *Duplicate content* → single source + canonical on the blog view; slides share the URL.
- *Slides not crawlable* → fine; blog view carries SEO, slides are engagement.
- *Scope creep* → ship P1–P5 with one post before adding archives/search/comments.
- *Brand drift across apps* → shared tokens + logo + header shell from day one.
```
