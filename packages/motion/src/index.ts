// Barrel export -- every motion primitive plus the shared lib utilities,
// re-exported under their real names so consumers only ever import from
// '@amalyte/motion'.

export { GlassCard } from './GlassCard';
export { TubeLine } from './TubeLine';
export { FluidBlob } from './FluidBlob';
export { Reveal } from './Reveal';
export { Parallax } from './Parallax';
export { Marquee } from './Marquee';
export { Grain } from './Grain';
export { Magnetic } from './Magnetic';
export { CursorDot } from './CursorDot';
export { ScrollProgressBar } from './ScrollProgressBar';

export { useReducedMotion } from './lib/useReducedMotion';
export { ScrollProvider } from './lib/ScrollProvider';
export { GlassDispersionFilter } from './lib/svgFilters';
