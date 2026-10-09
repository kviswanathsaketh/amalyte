/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@amalyte/tokens-core/tailwind.preset.js'),
    require('@amalyte/tokens-parent/tailwind.preset.js'),
  ],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    // GlassCard/GlassScrollScene/GlassParticles ship Tailwind classes from
    // the motion package (rounded-lg, shadow-e2, absolute inset-0, ...) —
    // scan its sources so those utilities are actually generated.
    '../../packages/motion/src/**/*.{ts,tsx}',
  ],
};
