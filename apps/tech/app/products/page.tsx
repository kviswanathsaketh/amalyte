// Technologies /products index — architecture §4.2, tech doc §3. The owned-IP
// catalogue. Per-product pages (/products/[slug]: problem → architecture →
// integrations → pricing → demo) don't exist yet, so cards are intentionally
// unlinked — no dead links (same convention as the homepage). The "Sign in /
// Go to app" handoff to amalyte.org (tech doc §6) ships with packages/auth,
// not here.
// 2026-08-27 "Liquid Monochrome" redesign: spacious light layout, thin
// headings, liquid-glass cards, and one dark full-bleed inspo band
// (glass-capsules.jpg under a black veil) carrying the CTA.
// Copy discipline: only facts from the property doc are stated. Smart CRM,
// Smart ERP, and MS AI Workspace have no published detail yet, so they get
// name + category only — no invented claims. Ecom Nexus carries its public
// positioning line and a link out to ecomnexus.io; deeper case-study
// treatment stays parked on tech doc open question #4 (mid-raise sensitivity).

import type { Metadata } from 'next';
import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { GlassCard, Reveal } from '@amalyte/motion';

export const metadata: Metadata = {
  title: 'Products — Amalyte Technologies',
  description:
    'Owned IP built and operated by Amalyte Technologies: Ecom Nexus, Smart CRM, Smart ERP, MS AI Workspace.',
};

const PRODUCTS = [
  {
    name: 'Ecom Nexus',
    category: 'E-commerce · Order management',
    line: 'Order management for brands past ₹1 Cr GMV — 12 carriers, one ledger.',
    note: 'Operates independently as a subsidiary at ecomnexus.io.',
    href: 'https://ecomnexus.io',
  },
  {
    name: 'Smart CRM',
    category: 'Customer relationship management',
    line: null,
    note: null,
    href: null,
  },
  {
    name: 'Smart ERP',
    category: 'Enterprise resource planning',
    line: null,
    note: null,
    href: null,
  },
  {
    name: 'MS AI Workspace',
    category: 'AI on the Microsoft stack',
    line: null,
    note: null,
    href: null,
  },
];

export default function Products() {
  return (
    <>
      <main>
        {/* Header — restrained, same register as the homepage hero. */}
        <section className="mx-auto max-w-content px-6 pb-20 pt-28 md:pt-36">
          <h1 className="max-w-3xl text-display font-display text-ink-900">
            Products
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
            Owned IP, built and operated by Amalyte. Each product page will
            walk problem, architecture, integrations, and pricing as it ships —
            no placeholder claims in the meantime.
          </p>
        </section>

        {/* Product index — liquid-glass cards on matte white. */}
        <section className="mx-auto max-w-content px-6 pb-24 md:pb-32">
          <div className="grid gap-6 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <Reveal key={p.name}>
                {/* Hairline border under the glass rim — the rim is white-on-
                    white against the paper background without it. */}
                <GlassCard interactive className="h-full border border-ink-100 p-8">
                  <p className="text-caption uppercase tracking-wide text-ink-500">
                    {p.category}
                  </p>
                  <h2 className="mt-1 text-h2 font-display font-light text-ink-900">{p.name}</h2>
                  {p.line && <p className="mt-3 text-body text-ink-700">{p.line}</p>}
                  {p.note && <p className="mt-2 text-caption text-ink-500">{p.note}</p>}
                  {p.href && (
                    <div className="mt-4">
                      <Button variant="text-link" href={p.href}>
                        Visit ecomnexus.io
                      </Button>
                    </div>
                  )}
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA — the one dark band on this page: full-bleed glass-capsules
            inspo under a black veil, CTA copy on top. */}
        <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (next/image forwardRef vs this app's @types/react 18; runtime unaffected). */}
          <Image
            src="/inspo/glass-capsules.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 mx-auto max-w-content px-6 py-32 md:py-40">
            <Reveal>
              <h2 className="max-w-2xl text-h1 font-display text-ink-900">
                Evaluating one of these for your operation?
              </h2>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button variant="solid" href="mailto:contact@amalyte.com">
                  Talk to an engineer
                </Button>
                <Button variant="text-link" href="/">
                  Back to Technologies
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer active="tech" />
    </>
  );
}
