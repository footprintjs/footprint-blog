'use client';
import { useState } from 'react';
import SlideFigure from './SlideFigure';
import { finalStep } from './sections';
import { slugify } from './slug';

// Blog lens: each content section = ONE figure (the section's final built step) + authored prose.
// A grouped section (several progressive slides) collapses to its last step here — no slide dump.
// Each section has a sticky header with an anchor link so a reader can deep-link / share it.
// 'Title' and 'Close' are deck bookends — Title is the article header (PostView), Close is the CTA.
export default function BlogView({ post }) {
  const content = post.sections.filter((s) => s.key !== 'Title' && s.key !== 'Close');
  const [copied, setCopied] = useState('');

  function copyLink(e, id) {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, '', `#${id}`);
    try { navigator.clipboard.writeText(url); } catch (_) {}
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? '' : c)), 1600);
  }

  return (
    <article>
      {content.map((s) => {
        const id = slugify(s.key);
        return (
          <section id={id} className="post-section" key={id}>
            <div className="section-head">
              <a
                className="section-anchor"
                href={`#${id}`}
                onClick={(e) => copyLink(e, id)}
                title="Copy link to this section"
                aria-label={`Copy link to “${s.heading}”`}
              >
                #
              </a>
              <div className="section-head-text">
                <p className="eyebrow">{s.label}</p>
                <h2>{s.heading}</h2>
              </div>
              {copied === id ? <span className="section-copied" aria-live="polite">link copied ✓</span> : null}
            </div>
            <SlideFigure html={finalStep(s)} />
            {s.body ? <div className="prose" dangerouslySetInnerHTML={{ __html: s.body }} /> : null}
          </section>
        );
      })}

      <div className="post-cta">
        <p>That's the pattern. It powers a whole stack.</p>
        <p><a href="https://footprintjs.github.io/">Explore the footprintjs ecosystem →</a></p>
      </div>
    </article>
  );
}
