/** @type {import('tailwindcss').Config} */
// Labs-specific token extension — combine with @amalyte/tokens-core/tailwind.preset.js
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
      // Headline personality (fluid-ui skill §15: size-specific tracking) --
      // overrides tokens-core's generic display/h1 tuples with this property's
      // own weight/tracking/scale-multiplier voice (spec §2–3).
      fontSize: {
        display: [
          'calc(var(--t-display) * var(--scale-display-mult))',
          {
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tracking-headline)',
            fontWeight: 'var(--weight-headline)',
          },
        ],
        h1: [
          'var(--t-h1)',
          {
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tracking-headline)',
            fontWeight: 'var(--weight-headline)',
          },
        ],
      },
    },
  },
};
