'use client';
import { useEffect, useState } from 'react';
import BlogView from './BlogView';
import SlideDeck from './SlideDeck';

// The dual-view controller. Defaults to 'read' so the server-rendered HTML is the article
// (the SEO surface); 'slides' is a client-only lens over the SAME sections. Deep-linkable
// via ?view=slides, and the toggle keeps the URL in sync without a reload.
export default function PostView({ post }) {
  const [view, setView] = useState('read');

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'slides') setView('slides');
  }, []);

  function choose(next) {
    setView(next);
    const u = new URL(window.location.href);
    if (next === 'slides') u.searchParams.set('view', 'slides');
    else u.searchParams.delete('view');
    window.history.replaceState(null, '', u);
  }

  return (
    <main id="main" className="wrap wide">
      <header className="post-head">
        <p className="eyebrow">Primer</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        <p className="byline">
          By {post.author} · {new Date(post.date + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
        </p>
      </header>

      <div className="view-toggle" role="group" aria-label="Choose a view">
        <button aria-pressed={view === 'read'} onClick={() => choose('read')}>Read it</button>
        <button aria-pressed={view === 'slides'} onClick={() => choose('slides')}>Watch it</button>
      </div>

      {view === 'read'
        ? <BlogView post={post} />
        : <SlideDeck steps={post.deckSteps} />}
    </main>
  );
}
