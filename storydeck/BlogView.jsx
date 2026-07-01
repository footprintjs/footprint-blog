'use client';
import SlideFigure from './SlideFigure';

// Blog lens: each content section = its slide (as a still figure) + the authored prose.
// 'Title' and 'Close' are deck bookends — Title is covered by the article header (in PostView),
// and Close becomes the CTA at the end.
export default function BlogView({ post }) {
  const content = post.sections.filter((s) => s.label !== 'Title' && s.label !== 'Close');

  return (
    <article>
      {content.map((s, i) => (
        <section className="post-section" key={i}>
          {/* real heading for document structure / SEO / screen readers; the figure is the visual */}
          <p className="eyebrow">{s.label}</p>
          <h2>{s.heading}</h2>
          <SlideFigure html={s.html} />
          {s.body ? <div className="prose" dangerouslySetInnerHTML={{ __html: s.body }} /> : null}
        </section>
      ))}

      <div className="post-cta">
        <p>That's the pattern. It powers a whole stack.</p>
        <p><a href="https://footprintjs.github.io/">Explore the footprintjs ecosystem →</a></p>
      </div>
    </article>
  );
}
