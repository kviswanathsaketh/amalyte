import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlassParticles } from './GlassParticles';
import { GlassScrollScene } from './GlassScrollScene';

// jsdom has no WebGL2 (getContext returns null) and the setup's default
// matchMedia reports a narrow viewport, so useHeroActivation fails and both
// components must render their static fallback — never a blank div, never a
// crash. IntersectionObserver is stubbed (absent in jsdom) recording but
// never firing, matching HeroScene.test.tsx's "not yet near viewport" state.
function stubIntersectionObserver() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(_callback: IntersectionObserverCallback) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
}

describe('GlassParticles (activation rule fails)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the droplet-cluster fallback, decorative only', () => {
    stubIntersectionObserver();
    const { container } = render(<GlassParticles />);
    const host = container.firstElementChild;
    expect(host).toHaveAttribute('aria-hidden', 'true');
    // The fallback layer mounts (jsdom's CSSOM may drop the multi-gradient
    // background declaration, so assert structurally); no canvas.
    expect(host?.children).toHaveLength(1);
    expect(container.querySelector('canvas')).toBeNull();
  });
});

describe('GlassScrollScene (activation rule fails)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the fallback inside a sticky viewport-height layer, children above it', () => {
    stubIntersectionObserver();
    const { container } = render(
      <GlassScrollScene>
        <section>Section one</section>
      </GlassScrollScene>
    );
    const sticky = container.querySelector('[style*="sticky"]');
    expect(sticky).toBeTruthy();
    expect(sticky).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.textContent).toContain('Section one');
  });
});
