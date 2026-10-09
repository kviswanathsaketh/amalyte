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

  // Liquid Monochrome: hairline frame, thin display type, matte monochrome
  // at rest -- the violet accent is spent only on hover and on the selected
  // intent/CTA.
  return (
    <div className="border-y border-ink-100 py-12 md:py-16">
      <p className="text-h2 font-display text-ink-900">
        I need to{' '}
        <span className={selected ? 'text-accent' : 'text-ink-300'}>
          {selected ? selected.label : '___'}
        </span>
      </p>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Choose what you need">
        {INTENTS.map((intent) => (
          <button
            key={intent.key}
            type="button"
            data-property={intent.property}
            aria-pressed={selected?.key === intent.key}
            onClick={() => setSelected(intent)}
            className={`min-h-11 rounded-full border px-5 text-body transition-colors duration-fast ease-amalyte ${
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
        <div className="mt-10 border-t border-ink-100 pt-8">
          <p className="max-w-2xl text-body-lg text-ink-700">{selected.blurb}</p>
          <a
            href={`${selected.href}?intent=${selected.key}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-900 px-6 font-medium text-paper transition-colors duration-fast ease-amalyte hover:bg-accent hover:text-accent-contrast"
          >
            Go to Amalyte {selected.division}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}
    </div>
  );
}
