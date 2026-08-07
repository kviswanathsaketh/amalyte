import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders an anchor when href is given', () => {
    render(<Button variant="solid" href="/work">See work</Button>);
    const link = screen.getByRole('link', { name: /see work/i });
    expect(link).toHaveAttribute('href', '/work');
  });

  it('renders a button element when no href is given', () => {
    render(<Button variant="solid">Submit</Button>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('appends a directional arrow only for the text-link variant', () => {
    const { rerender } = render(<Button variant="text-link">Read more</Button>);
    expect(screen.getByText('→')).toBeInTheDocument();

    rerender(<Button variant="solid">Read more</Button>);
    expect(screen.queryByText('→')).not.toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button variant="outline" onClick={onClick}>Click me</Button>);
    screen.getByRole('button', { name: /click me/i }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
