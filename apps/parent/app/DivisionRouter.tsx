'use client';

// DivisionRouter — the Parent homepage's signature module (architecture §4.0):
// "I need to ___" → four intents, each routing into the right division
// subdomain with the chosen intent preserved as a query param so the
// destination can pick up the context. Parent-only by design, so it lives
// app-side rather than in @amalyte/ui (governance: shared package is for
// components two+ properties need).

import { useState } from 'react';

const INTENTS = [
  {
    key: 'get-noticed',
    label: 'get noticed',
    division: 'Studio',
    property: 'studio',
    href: 'https://studio.amalyte.com',
    blurb: 'Marketing & media — brand, campaigns, film, and the work that wins attention.',
  },
  {
    key: 'build-software',
    label: 'build software',
    division: 'Technologies',
    property: 'tech',
    href: 'https://tech.amalyte.com',
    blurb: 'Engineering — platforms, products, and systems built to run businesses.',
  },
  {
    key: 'train-my-team',
    label: 'train my team',
    division: 'Learn',
    property: 'learn',
    href: 'https://learn.amalyte.com',
    blurb: 'Training — practical, outcome-led programs for teams that need to ship.',
  },
  {
    key: 'make-a-product',
    label: 'make a product',
    division: 'Labs',
    property: 'labs',
    href: 'https://labs.amalyte.com',
    blurb: 'Product innovation — from prototype to production hardware and software.',
  },
] as const;

export function DivisionRouter() {
  const [selected, setSelected] = useState<(typeof INTENTS)[number] | null>(null);

  return (
    <div className="rounded-lg border border-ink-100 bg-paper p-8 md:p-12">
      <p className="text-h2 font-display text-ink-900">
        I need to{' '}
        <span className="text-accent">{selected ? selected.label : '___'}</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Choose what you need">
        {INTENTS.map((intent) => (
          <button
            key={intent.key}
            type="button"
            data-property={intent.property}
            aria-pressed={selected?.key === intent.key}
            onClick={() => setSelected(intent)}
            className={`min-h-11 rounded-full border-2 px-5 text-body font-medium transition-colors duration-fast ease-amalyte ${
              selected?.key === intent.key
                ? 'border-accent bg-accent text-accent-contrast'
                : 'border-ink-300 text-ink-700 hover:border-accent hover:text-accent'
            }`}
          >
            {intent.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 border-t border-ink-100 pt-6">
          <p className="text-body-lg text-ink-700">{selected.blurb}</p>
          <a
            href={`${selected.href}?intent=${selected.key}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-contrast hover:opacity-90 transition-opacity duration-fast ease-amalyte"
          >
            Go to Amalyte {selected.division}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}
    </div>
  );
}
