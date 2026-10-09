import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroScene } from './HeroScene';
import type { HeroPalette } from './palette';

// Parent's tokens — an arbitrary real palette; any property's would do.
const PALETTE: HeroPalette = {
  highlight: '#F5D9D2',
  core: '#C47C6D',
  shadow: '#7A3D38',
  accent: '#C47C6D',
};

// Match the activation mock style from useHeroActivation.test.tsx — the
// matchMedia fixture decides whether the scene's activation rule passes.
function mockMatchMedia(fixture: { wide: boolean; reduced: boolean }) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return query.includes('min-width') ? fixture.wide : fixture.reduced;
        },
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList
  );
}

function mockWebGL2(available: boolean) {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((() =>
    available ? {} : null) as never);
}

// IntersectionObserver stub that records observed targets but never reports
// an intersection — the "hero not yet near viewport" state.
function stubIntersectionObserver() {
  const instances: Array<{ callback: IntersectionObserverCallback }> = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        instances.push({ callback });
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  return instances;
}

describe('HeroScene', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the CSS gradient fallback (never blank) when the activation rule fails', () => {
    // Default jsdom: narrow viewport per setup.ts (matchMedia matches:false).
    const { container } = render(<HeroScene palette={PALETTE} />);
    const fallback = container.querySelector('[aria-hidden="true"] > [aria-hidden="true"]');
    expect(fallback).toBeTruthy();
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders the poster still instead of the gradient when posterSrc is given', () => {
    const { container } = render(
      <HeroScene palette={PALETTE} posterSrc="/posters/parent-hero.webp" />
    );
    const poster = container.querySelector('img');
    expect(poster).toHaveAttribute('src', '/posters/parent-hero.webp');
    // Decorative: no accessible name, hidden from assistive tech.
    expect(poster).toHaveAttribute('alt', '');
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('does not mount the canvas before the hero nears the viewport, even when active', () => {
    mockMatchMedia({ wide: true, reduced: false });
    mockWebGL2(true);
    const observers = stubIntersectionObserver();

    const { container } = render(<HeroScene palette={PALETTE} />);

    // Activation passed (observer created) but no intersection yet — the
    // canvas stays unmounted (spec §3 guardrail 2) and the fallback shows.
    expect(observers).toHaveLength(1);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('never creates an IntersectionObserver when the activation rule fails', () => {
    mockMatchMedia({ wide: false, reduced: false });
    mockWebGL2(true);
    const observers = stubIntersectionObserver();

    render(<HeroScene palette={PALETTE} />);
    expect(observers).toHaveLength(0);
  });

  // NOTE: the mounted-canvas path is deliberately untested — jsdom has no
  // real WebGL, and per this package's test policy we don't fake one.
});
