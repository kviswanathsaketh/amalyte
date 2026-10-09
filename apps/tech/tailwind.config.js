/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@amalyte/tokens-core/tailwind.preset.js'),
    require('@amalyte/tokens-tech/tailwind.preset.js'),
  ],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    // GlassCard/Reveal class names (shadow-e2, isolate, …) must be scannable
    // or Tailwind never generates them for this app.
    '../../packages/motion/src/**/*.{ts,tsx}',
  ],
};
