/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@amalyte/tokens-core/tailwind.preset.js'),
    require('@amalyte/tokens-parent/tailwind.preset.js'),
  ],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
