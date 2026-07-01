import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogView from './BlogView';

const post = {
  sections: [
    { key: 'Title', label: 'Title', heading: 'T', steps: ['<section>t</section>'], body: '' },
    {
      key: 'whiteboard', label: 'THE WHITEBOARD', heading: 'Every system begins as a drawing',
      steps: ['<section>build-a</section>', '<section>build-final</section>'], body: '<p>the prose</p>',
    },
    { key: 'Close', label: 'Close', heading: 'C', steps: ['<section>c</section>'], body: '' },
  ],
};

describe('BlogView', () => {
  it('renders content sections but skips the Title/Close bookends', () => {
    render(<BlogView post={post} />);
    expect(screen.getByRole('heading', { name: 'Every system begins as a drawing' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'T' })).not.toBeInTheDocument();
  });

  it('shows the FINAL step as the figure (grouping collapses to last)', () => {
    const { container } = render(<BlogView post={post} />);
    const canvas = container.querySelector('.slide-figure-canvas');
    expect(canvas.innerHTML).toContain('build-final');
    expect(canvas.innerHTML).not.toContain('build-a');
  });

  it('gives each section an anchor id and renders the prose', () => {
    const { container } = render(<BlogView post={post} />);
    expect(container.querySelector('#whiteboard')).toBeTruthy();
    expect(screen.getByText('the prose')).toBeInTheDocument();
  });

  it('copies a shareable link when the anchor is clicked', async () => {
    render(<BlogView post={post} />);
    await userEvent.click(screen.getByLabelText(/Copy link to/));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText('link copied ✓')).toBeInTheDocument();
  });

  it('clears the "copied" indicator after a moment', () => {
    vi.useFakeTimers();
    render(<BlogView post={post} />);
    fireEvent.click(screen.getByLabelText(/Copy link to/));
    expect(screen.getByText('link copied ✓')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1700));
    expect(screen.queryByText('link copied ✓')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders a figure-only section with no prose', () => {
    const p = { sections: [{ key: 'x', label: 'X', heading: 'H', steps: ['<section>s</section>'], body: '' }] };
    const { container } = render(<BlogView post={p} />);
    expect(container.querySelector('.prose')).toBeNull();
  });
});
