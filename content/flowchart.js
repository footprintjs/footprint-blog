// Post #1 — single source. The 13 deck sections (from deck-data.json) are the shared spine:
// the slide view animates them; the blog view shows each as a still figure + the prose below.
import data from './deck-data.json';

// Authored blog prose, keyed by the deck section's data-label. Title/Close are deck bookends
// (rendered as the article header + a closing CTA), so they have no body here.
const BODIES = {
  'The Whiteboard': `<p>Before a line of code exists, this is how a system is born: someone draws boxes for the steps and arrows for what happens next. It's the most natural way humans reason about a process — a request comes in, it gets validated, a decision is made, and it branches.</p>
<p>The drawing is honest. Nothing is hidden; the whole flow fits on one board.</p>`,

  'Everyone Reads It': `<p>The reason the whiteboard works is that <strong>everyone can read it</strong> — a product manager, an engineer, a support lead, and a brand-new hire all follow the same picture without reading a single line of code.</p>
<p>That shared understanding is the most valuable thing a team has. And it's exactly what we lose in the next step.</p>`,

  'The Drift': `<p>Then we implement it. The code that ships almost never looks like the drawing — control flow scatters across files, functions, callbacks and services. The clean shape on the board dissolves into a thousand details.</p>
<p>The map and the territory drift apart. The drawing goes stale on day one, and from then on the <em>only</em> source of truth is the code — which no one but engineers can read.</p>`,

  'The Cost': `<p>Fast-forward six months. Something goes wrong, or a decision surprises someone, and the question comes: <strong>"why did it do that?"</strong></p>
<p>The drawing is long gone. The answer is buried in scattered logs — if it was logged at all. Reconstructing what actually happened becomes an archaeology project, and the confident answer you need is rarely there.</p>`,

  'The Flip': `<p>So here's the flip. What if the code <strong>were</strong> the flowchart? Not a drawing that describes the system and rots — but the running system itself, shaped like the picture you drew.</p>
<p>One artifact, drawn and run. That's the whole idea behind the flowchart pattern.</p>`,

  'Same Shape': `<p>In practice that means you build the same shape you sketched: each box becomes a named stage, each arrow a transition — explicit, in order, in one place.</p>
<p>The thing that runs is the thing you read. There's no translation step to drift out of sync, because the structure <em>is</em> the definition.</p>`,

  'It Records Itself': `<p>Because the structure is explicit, the system can record itself <strong>as it runs</strong> — every read, write, and decision captured in order, as a side effect of simply executing.</p>
<p>This is the opposite of reconstructing history from logs after the fact. The trace isn't rebuilt later; it's the execution record, collected inline, the first time.</p>`,

  'Backtrack The Why': `<p>Now "why did it do that?" has an answer by construction. Take any output and walk the footprints backward to the exact step — and the exact value — that caused it.</p>
<p>No guessing, no archaeology. The path from an answer to its cause is just a walk back up the trace.</p>`,

  'Many Lenses': `<p>One trustworthy record, and everyone picks their lens. The same footprint becomes a metric for a manager, a plain-language narrative for a PM, and a visual flowchart for an engineer or a debugger.</p>
<p>You don't rebuild the truth per audience — you re-view the one record. That's the whiteboard's "everyone reads it," restored.</p>`,

  'Scales To Agents': `<p>The pattern doesn't stop at backend pipelines. Wrap an AI agent the same way and the hardest question in all of software — <strong>why did the model do that?</strong> — is answered by construction: which context was injected, which tool was called, which decision was made, and when.</p>
<p>Same shape, same trace, same "walk it back." That's why the ecosystem exists.</p>`,

  'The Ecosystem': `<p>One idea, a whole stack. <strong>footprintjs</strong> is the core engine. <strong>agentfootprint</strong> builds self-explaining AI agents on top of it. And the UIs — <strong>Explainable UI</strong>, <strong>Lens</strong>, and <strong>Thinking UI</strong> — render and replay that record for engineers and non-developers alike.</p>
<p>Core engine → agentic framework → the interfaces that show it. Every piece is the same pattern, wearing a different lens.</p>`,
};

// Real headlines per section — used as the reading heading (SEO + screen readers), since the
// slide figure itself is aria-hidden (a visual). Keyed by the deck section's data-label.
const HEADINGS = {
  'The Whiteboard': 'Every system begins as a drawing',
  'Everyone Reads It': 'A PM, an engineer, and a new hire all understand it',
  'The Drift': "But the code doesn't look like the drawing",
  'The Cost': '“Why did it do that?”',
  'The Flip': 'What if the code were the flowchart?',
  'Same Shape': 'The thing that runs is the thing you read',
  'It Records Itself': 'Every run records itself',
  'Backtrack The Why': 'Walk back to the exact cause',
  'Many Lenses': 'Everyone picks their lens',
  'Scales To Agents': 'The same pattern wraps an AI agent',
  'The Ecosystem': 'Built on the pattern',
};

export const post = {
  slug: 'the-flowchart-pattern',
  title: 'The Flowchart Pattern',
  description: 'How a whiteboard sketch becomes software that explains itself — a primer on the pattern behind footprintjs.',
  date: '2026-06-30',
  author: 'Sanjay Krishna Anbalagan',
  tags: ['primer', 'flowchart-pattern'],
  deckCss: data.deckCss,
  sections: data.sections.map((s) => ({ label: s.label, heading: HEADINGS[s.label] || s.label, html: s.html, body: BODIES[s.label] || '' })),
};

export const posts = [post];
export function getPost(slug) { return posts.find((p) => p.slug === slug) || null; }
