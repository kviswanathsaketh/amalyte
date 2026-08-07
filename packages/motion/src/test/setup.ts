import '@testing-library/jest-dom/vitest';

// jsdom doesn't expose SVG geometry methods (or even an SVGPathElement
// global) -- patch the real prototype behind a created <path>, which works
// regardless of what jsdom names or exposes it as.
const svgPathProto = Object.getPrototypeOf(
  document.createElementNS('http://www.w3.org/2000/svg', 'path')
);
if (typeof svgPathProto.getTotalLength !== 'function') {
  svgPathProto.getTotalLength = () => 100;
}
if (typeof svgPathProto.getPointAtLength !== 'function') {
  svgPathProto.getPointAtLength = (length: number) =>
    ({
      x: length,
      y: length,
      z: 0,
      w: 1,
      matrixTransform: () => ({ x: 0, y: 0, z: 0, w: 1 }) as DOMPoint,
      toJSON: () => ({}),
    }) as DOMPoint;
}

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
