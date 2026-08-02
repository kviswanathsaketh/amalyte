/** @type {import('tailwindcss').Config} */
// Learn-specific token extension — combine with @amalyte/tokens-core/tailwind.preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          300: 'var(--ink-300)',
          100: 'var(--ink-100)',
        },
        paper: 'var(--paper)',
        accent: 'var(--accent)',
        'accent-contrast': 'var(--accent-contrast)',
        gradient: {
          highlight: 'var(--gradient-highlight)',
          core: 'var(--gradient-core)',
          shadow: 'var(--gradient-shadow)',
        },
      },
    },
  },
};
