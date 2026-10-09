import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HERO_MIN_VIEWPORT_WIDTH,
  isWebGL2Available,
  useHeroActivation,
} from './useHeroActivation';

// --- Mock helpers ---------------------------------------------------------

// matchMedia stub where `matches` is a live getter, so flipping the fixture
// values and firing the captured change listeners re-evaluates the hook.
function mockMatchMedia(fixture: { wide: boolean; reduced: boolean }) {
  const listeners: Array<() => void> = [];
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return query.includes('min-width') ? fixture.wide : fixture.reduced;
        },
        media: query,
        addEventListener: (_event: string, callback: () => void) => listeners.push(callback),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList
  );
  return {
    fireChange() {
      act(() => listeners.forEach((listener) => listener()));
    },
  };
}

// WebGL2 probe stub — isWebGL2Available only ever asks for 'webgl2'.
function mockWebGL2(available: boolean) {
  return vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation((() => (available ? {} : null)) as never);
}

// --- Tests ----------------------------------------------------------------

describe('isWebGL2Available', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when a webgl2 context is created', () => {
    mockWebGL2(true);
    expect(isWebGL2Available()).toBe(true);
  });

  it('returns false when getContext returns null', () => {
    mockWebGL2(false);
    expect(isWebGL2Available()).toBe(false);
  });

  it('returns false when getContext throws (locked-down environments)', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((() => {
      throw new Error('not implemented');
    }) as never);
    expect(isWebGL2Available()).toBe(false);
  });
});

describe('useHeroActivation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('activates when viewport is wide, WebGL2 exists, and motion is allowed', () => {
    mockMatchMedia({ wide: true, reduced: false });
    mockWebGL2(true);
    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(true);
  });

  it(`stays inactive below ${HERO_MIN_VIEWPORT_WIDTH}px viewport width`, () => {
    mockMatchMedia({ wide: false, reduced: false });
    const getContext = mockWebGL2(true);
    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(false);
    // Short-circuit: the WebGL2 probe is skipped when the viewport already rules it out.
    expect(getContext).not.toHaveBeenCalled();
  });

  it('stays inactive without WebGL2, even on a wide motion-allowed viewport', () => {
    mockMatchMedia({ wide: true, reduced: false });
    mockWebGL2(false);
    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(false);
  });

  it('stays inactive when the user prefers reduced motion', () => {
    mockMatchMedia({ wide: true, reduced: true });
    mockWebGL2(true);
    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(false);
  });

  it('returns false during server render (SSR-safe default)', () => {
    mockMatchMedia({ wide: true, reduced: false });
    mockWebGL2(true);
    function Probe() {
      return <span>{String(useHeroActivation())}</span>;
    }
    // Effects never run in renderToString, so this captures exactly what a
    // server render emits — the scene must stay opt-in on the client.
    expect(renderToString(<Probe />)).toContain('false');
  });

  it('deactivates live when the reduced-motion preference turns on', () => {
    const fixture = { wide: true, reduced: false };
    const media = mockMatchMedia(fixture);
    mockWebGL2(true);

    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(true);

    fixture.reduced = true;
    media.fireChange();
    expect(result.current).toBe(false);
  });

  it('deactivates live when the viewport shrinks below the minimum', () => {
    const fixture = { wide: true, reduced: false };
    const media = mockMatchMedia(fixture);
    mockWebGL2(true);

    const { result } = renderHook(() => useHeroActivation());
    expect(result.current).toBe(true);

    fixture.wide = false;
    media.fireChange();
    expect(result.current).toBe(false);
  });
});
