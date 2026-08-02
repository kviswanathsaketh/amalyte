/** @type {import('tailwindcss').Config} */
// Shared base preset — combine with the active property's preset in each app's
// tailwind.config.js, e.g.:
//   presets: [require('@amalyte/tokens-core/tailwind.preset.js'), require('@amalyte/tokens-parent/tailwind.preset.js')]
module.exports = {
  theme: {
    extend: {
      colors: {
        success: 'var(--success)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        display: 'var(--t-display)',
        h1: 'var(--t-h1)',
        h2: 'var(--t-h2)',
        h3: 'var(--t-h3)',
        'body-lg': 'var(--t-body-lg)',
        body: 'var(--t-body)',
        caption: 'var(--t-caption)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        full: 'var(--r-full)',
      },
      boxShadow: {
        e1: 'var(--e1)',
        e2: 'var(--e2)',
        e3: 'var(--e3)',
      },
      transitionTimingFunction: {
        amalyte: 'var(--ease-amalyte)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      maxWidth: {
        content: 'var(--content-max)',
        bleed: 'var(--bleed-max)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
      },
    },
  },
};
