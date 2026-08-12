// Explicit PostCSS config — Next 16's Turbopack does not reliably auto-detect
// Tailwind v3 in this monorepo layout, so declare the standard plugin pair.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
