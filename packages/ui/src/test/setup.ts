import '@testing-library/jest-dom/vitest';

// @amalyte/motion's barrel re-exports Reveal, which registers GSAP's
// ScrollTrigger plugin at module scope -- that registration calls
// window.matchMedia, which jsdom doesn't implement. Any test that imports
// anything from '@amalyte/motion' (even a named export from a different
// file) evaluates the whole barrel, so this needs to be mocked here too,
// same as packages/motion/src/test/setup.ts.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
