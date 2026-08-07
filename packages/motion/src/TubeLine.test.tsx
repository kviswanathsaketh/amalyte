import { render } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { TubeLine } from './TubeLine';

describe('TubeLine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('auto-loops the orb via SMIL animateMotion when uncontrolled', () => {
    const { container } = render(<TubeLine path="M0 0 L100 0" />);
    expect(container.querySelector('animateMotion')).toBeTruthy();
  });

  it('freezes the orb at a fixed position when progress is controlled', () => {
    const { container } = render(<TubeLine path="M0 0 L100 0" progress={0.25} />);
    expect(container.querySelector('animateMotion')).toBeFalsy();
  });

  it('freezes the orb when the OS prefers reduced motion, even without a progress prop', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { container } = render(<TubeLine path="M0 0 L100 0" />);
    expect(container.querySelector('animateMotion')).toBeFalsy();
  });

  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<TubeLine path="M0 0 L100 0" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
