import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostView from './PostView';

const post = {
  title: 'The Flowchart Pattern', description: 'a primer', date: '2026-06-30', author: 'Sanjay',
  sections: [{ key: 's1', label: 'S1', heading: 'First point', steps: ['<section>one</section>'], body: '<p>b</p>' }],
  deckSteps: ['<section>one</section>'],
};

describe('PostView', () => {
  it('renders the article header and defaults to the Read lens', () => {
    render(<PostView post={post} />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Flowchart Pattern' })).toBeInTheDocument();
    expect(screen.getByText('First point')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read it' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches to the Watch lens on toggle', async () => {
    const { container } = render(<PostView post={post} />);
    await userEvent.click(screen.getByRole('button', { name: 'Watch it' }));
    expect(screen.getByRole('button', { name: 'Watch it' })).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('.deck-shell')).toBeTruthy();
  });

  it('opens the Watch lens directly from a ?view=slides deep link', () => {
    window.history.replaceState({}, '', '/blog/x?view=slides');
    const { container } = render(<PostView post={post} />);
    expect(container.querySelector('.deck-shell')).toBeTruthy();
    window.history.replaceState({}, '', '/');
  });

  it('returns to Read and drops ?view from the URL', async () => {
    window.history.replaceState({}, '', '/blog/x?view=slides');
    render(<PostView post={post} />);
    await userEvent.click(screen.getByRole('button', { name: 'Read it' }));
    expect(screen.getByRole('button', { name: 'Read it' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toBe('');
    window.history.replaceState({}, '', '/');
  });
});
