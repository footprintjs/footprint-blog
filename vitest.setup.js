import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  document.documentElement.className = '';
  try { localStorage.clear(); } catch (_) {}
  // SlideDeck appends this to <body> directly (outside React), so clear it between tests.
  document.querySelectorAll('script[data-deck-stage]').forEach((s) => s.remove());
});

// jsdom lacks these; storydeck's figure + copy features use them.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn(() => Promise.resolve()) },
    configurable: true,
  });
}
