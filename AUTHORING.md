# Authoring model — JSON structure + Markdown prose (proposal)

> How a post is written. Goal: **Medium/Substack-quality reading**, authored as data + Markdown,
> rendered into both lenses (Read + Watch) by the storydeck engine. Proposal — not built yet.

## The split (what the user proposed)

- **JSON** = *structure*: which deck slides group into which section, section order, headings,
  and post metadata. The machine-y part.
- **Markdown** = *prose*: the actual writing per section — headings, bold, lists, quotes, code,
  links, images. The human part. This is what gives the Medium/Substack feel.
- **Deck** = the slides (imported from Claude Design → `deck-data.json`).

The engine merges the three into the normalized `Post` the renderers already consume:
`Post = { meta, sections: [{ key, heading, steps: [slideHtml…], bodyHtml }] }`.

## Per-post file layout

```
content/posts/the-flowchart-pattern/
  post.json            # structure: meta + sections (slide grouping + heading + body ref)
  deck-data.json       # the imported deck slides (from `storydeck import`)
  body/
    whiteboard.md      # Markdown prose for the "whiteboard" section
    trace.md           # …one file per section
    …
```

**post.json**

```json
{
  "slug": "the-flowchart-pattern",
  "title": "The Flowchart Pattern",
  "description": "How a whiteboard sketch becomes software that explains itself.",
  "date": "2026-06-30",
  "author": "Sanjay Krishna Anbalagan",
  "tags": ["primer", "flowchart-pattern"],
  "sections": [
    { "key": "whiteboard", "heading": "Every system begins as a drawing",
      "slides": ["The Whiteboard"], "body": "whiteboard.md" },

    { "key": "trace", "heading": "It records itself, and you can walk it back",
      "slides": ["It Records Itself", "Backtrack The Why"], "body": "trace.md" }
  ]
}
```

- `slides` = **the grouping**: one label → a normal section; **several labels → a group** (Read
  shows the *last* slide as one figure; Watch plays them all). This is grouping declared in
  data (author-controlled) — cleaner than `data-group` attributes in the deck, and both can be
  supported (JSON wins).
- `body` → a Markdown file. Sections with no `body` render figure-only; sections with no `slides`
  render prose-only (a classic text post). Same engine, both work.

**body/*.md** — plain Markdown. Rendered to HTML at build and dropped into the Read view under
the section's figure. Rich typography styling makes it read like Medium/Substack.

## The abstraction (library boundary)

storydeck gains a small **content-adapter** — the only new piece:

```
storydeck/content/
  loadPost(dir)      # reads post.json + deck-data.json + body/*.md → normalized Post
  renderMarkdown(md) # Markdown → HTML (pluggable; consumer can swap the renderer)
  registry(glob)     # discovers content/posts/** → the posts list + getPost(slug)
```

- The **renderers don't change** — they already take `{ heading, steps, bodyHtml }`. We're only
  adding an authoring→`Post` adapter in front of them.
- **Markdown renderer is pluggable** (default: `markdown-it` — small, safe, plugins for heading
  anchors + typography). Upgrade path: **MDX** if you later want to embed live components (a real
  footprint widget) inside prose. Start with Markdown; MDX is a drop-in swap of `renderMarkdown`.
- The registry makes **"add a post = add a folder."**

## Reading experience (the Medium/Substack feel)

- Prose styled for reading: ~68ch measure, generous line-height, real `h3`/`blockquote`/`ul`/
  `code`/`img` styling, links with the brand accent.
- The sticky section header + figure + prose interleave gives an "annotated essay" rhythm.
- Author images live in `body/` and are referenced with normal Markdown `![alt](./img.png)`.

## Import flow (scalable authoring)

1. Build a deck in Claude Design → `storydeck import <projectId> <slug>` writes `deck-data.json`.
2. Write `post.json` (group slides into sections, give headings).
3. Write the `body/*.md` prose.
4. It appears (registry) — Read + Watch, SEO, RSS all automatic.

## Decisions to lock

1. **Markdown vs MDX** for `body` — recommend **Markdown (markdown-it)** now; MDX later if you
   want embedded interactive components.
2. **One `.md` per section** (clean, matches JSON) vs **one `post.md` with section markers** —
   recommend **one per section** (maps 1:1 to the JSON, easy to reorder).
3. **Sanitize** rendered Markdown HTML (once posts may come from others) — recommend yes
   (rehype-sanitize / DOMPurify) since we render HTML.
