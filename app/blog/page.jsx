import Link from 'next/link';
import { posts } from '../../content/flowchart';

export const metadata = {
  title: 'Blog',
  description: 'Primers and field notes on the flowchart pattern — the self-explaining stack.',
  alternates: { canonical: '/blog' },
};

function fmt(d) {
  return new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export default function BlogIndex() {
  return (
    <main id="main" className="wrap">
      <p className="eyebrow">footprintjs · blog</p>
      <h1 className="index-title">Field notes on the flowchart pattern</h1>
      <p className="index-sub">Read it, or watch it as a deck — same idea, your lens.</p>
      {posts.map((p) => (
        <Link key={p.slug} className="post-card" href={`/blog/${p.slug}`}>
          <p className="eyebrow" style={{ margin: 0 }}>Primer</p>
          <h2>{p.title}</h2>
          <p>{p.description}</p>
          <p className="meta">{fmt(p.date)} · {p.author}</p>
        </Link>
      ))}
    </main>
  );
}
