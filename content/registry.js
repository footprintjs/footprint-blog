import fs from 'node:fs';
import path from 'node:path';
import { assemblePost } from '../storydeck/content/loadPost';
import { scopeDeckCss } from '../storydeck/scopeDeckCss';
import { BASE } from '../site.config';

// The consumer's content registry: discovers every post folder under content/posts/** and assembles
// each into a normalized Post (structure from post.json, prose from body.md, slides from
// deck-data.json). Runs at build time (Node) for the static export. Adding a post = adding a folder.
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function loadOne(slug) {
  const dir = path.join(POSTS_DIR, slug);
  const { sections, ...meta } = readJson(path.join(dir, 'post.json'));
  const deck = readJson(path.join(dir, 'deck-data.json'));
  const bodyPath = path.join(dir, 'body.md');
  const bodyMd = fs.existsSync(bodyPath) ? fs.readFileSync(bodyPath, 'utf8') : '';

  // deploy-time asset prefixing lives in the consumer (not the engine): the slide HTML references
  // the logo at /assets/… → prefix with the base path.
  const deckSlides = deck.sections.map((s) => ({
    label: s.label,
    html: s.html.replaceAll('/assets/footprintjs-logo.png', `${BASE}/assets/footprintjs-logo.png`),
  }));

  const post = assemblePost({ meta, sections, bodyMd, deckSlides });
  post.deckCssScoped = scopeDeckCss(deck.deckCss); // per-post deck styles, injected on the post page
  return post;
}

export const posts = fs
  .readdirSync(POSTS_DIR)
  .filter((d) => fs.existsSync(path.join(POSTS_DIR, d, 'post.json')))
  .map(loadOne)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}
