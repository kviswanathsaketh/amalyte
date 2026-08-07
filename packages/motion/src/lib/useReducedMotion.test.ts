import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when the OS has no reduced-motion preference', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true immediately when the OS prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('subscribes to preference changes and updates on them', () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: (_event: string, handler: (event: MediaQueryListEvent) => void) => {
        changeHandler = handler;
      },
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
