'use client';
import { useEffect, useRef } from 'react';

// Slide (watch) lens: the SAME sections mounted into <deck-stage> (the deck's own web component,
// loaded from /deck-stage.js). We set innerHTML imperatively so React doesn't fight the runtime
// once it restructures the stage. Once the custom element is defined, remounts auto-upgrade.
export default function SlideDeck({ sections }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const inner = sections.map((s) => s.html).join('\n');
    el.innerHTML = `<deck-stage no-rail width="1920" height="1080">${inner}</deck-stage>`;
    if (!document.querySelector('script[data-deck-stage]')) {
      const sc = document.createElement('script');
      sc.src = '/deck-stage.js';
      sc.setAttribute('data-deck-stage', '');
      document.body.appendChild(sc);
    }
  }, [sections]);

  return (
    <>
      <div className="deck-shell deck-scope" ref={host} />
      <p className="deck-hint">← / → to navigate · Home / End to jump</p>
    </>
  );
}
