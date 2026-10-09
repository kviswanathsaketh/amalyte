// Parent /about — architecture §4.0, parent doc §5. Story, thesis,
// recognitions. This is the canonical "who is Amalyte" surface, so entity
// density matters for GEO (parent doc §5): name Amalyte / Amalyte LLP, each
// division, and each recognition explicitly, in structured language.
// Copy discipline: no invented dates or numbers. The spec's "timeline"
// element is deferred until real milestone dates are confirmed — a timeline
// with fabricated dates is worse than none (§5: every claim needs a number,
// a name, or a named client; placeholders are banned, not discouraged).

import type { Metadata } from 'next';
import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { Reveal } from '@amalyte/motion';

export const metadata: Metadata = {
  title: 'About — Amalyte Group',
  description:
    'Amalyte LLP is a Hyderabad-based group of four divisions — Studio, Technologies, Learn, and Labs — taking ideas from first sketch to shipped product.',
};

// Structured entity graph per parent doc §9 — the canonical Organization
// node the group's GEO strategy cites.
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Amalyte Group',
  legalName: 'Amalyte LLP',
  url: 'https://amalyte.com',
  description:
    'Group holding company for four divisions: Amalyte Studio (marketing & media), Amalyte Technologies (software & engineering), Amalyte Learn (learning & training), and Amalyte Labs (innovation & product development).',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressCountry: 'IN',
  },
  subOrganization: [
    { '@type': 'Organization', name: 'Amalyte Studio', url: 'https://studio.amalyte.com' },
    { '@type': 'Organization', name: 'Amalyte Technologies', url: 'https://tech.amalyte.com' },
    { '@type': 'Organization', name: 'Amalyte Learn', url: 'https://learn.amalyte.com' },
    { '@type': 'Organization', name: 'Amalyte Labs', url: 'https://labs.amalyte.com' },
  ],
};

const RECOGNITIONS = [
  {
    name: 'MSME registered',
    detail: 'Amalyte LLP is registered under the Government of India’s MSME framework.',
  },
  {
    name: 'Startup India recognised',
    detail: 'Recognised under the Startup India initiative.',
  },
  {
    name: 'Microsoft CSP',
    detail:
      'Cloud Solution Provider partner — Azure, Dynamics 365 Business Central, and Microsoft 365.',
  },
  {
    name: 'Implementation partnerships',
    detail: 'Certified implementation work across Odoo, ERPNext, and Bitrix24.',
  },
];

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />
      <main>
        {/* Story. */}
        <section className="mx-auto max-w-content px-6 pb-24 pt-28 md:pb-32 md:pt-40">
          <h1 className="max-w-3xl text-display font-display text-ink-900">
            Making ideas alive.
          </h1>
          <div className="mt-8 max-w-2xl space-y-5 text-body-lg text-ink-700">
            <p>
              Amalyte Group is the holding company for four divisions — Amalyte
              Studio, Amalyte Technologies, Amalyte Learn, and Amalyte Labs —
              run from Hyderabad by Amalyte LLP.
            </p>
            <p>
              The group exists because most ideas don’t die for lack of
              imagination. They die in the handoff — between the people who
              design them, the people who build them, and the people who have
              to run them. Amalyte puts all of those under one roof.
            </p>
          </div>
        </section>

        {/* Thesis — the mark: circle becoming square (parent doc §1). Dark
            inspo band (glass panels) with a veil for contrast; the accent
            stays out of the resting state here too. */}
        <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (same as studio/home); runtime unaffected. */}
          <Image
            src="/inspo/glass-panels.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto max-w-content px-6 py-32 md:py-48">
            <Reveal>
              <p className="text-caption uppercase tracking-wide text-ink-500">
                The thesis
              </p>
              <p className="mt-5 max-w-3xl text-h2 font-display text-ink-900">
                Our mark is a circle becoming a square — an idea taking the
                shape of something executable. That is the whole business:
                Studio makes it seen, Technologies makes it run, Learn makes
                it repeatable, and Labs makes it new.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Recognitions — named, structured, citable (GEO entity density). */}
        <section className="mx-auto max-w-content px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="text-h1 font-display text-ink-900">
              Recognitions & registrations
            </h2>
          </Reveal>
          <dl className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {RECOGNITIONS.map((r) => (
              <Reveal key={r.name}>
                <div className="border-t border-ink-100 pt-8">
                  <dt className="text-h3 font-display text-ink-900">{r.name}</dt>
                  <dd className="mt-3 text-body text-ink-700">{r.detail}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* CTA. */}
        <section className="mx-auto max-w-content px-6 py-28 md:py-40">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Want the people behind this?
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="/leadership">
                Meet the leadership
              </Button>
              <Button variant="text-link" href="mailto:contact@amalyte.com">
                Contact the group
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="parent" />
    </>
  );
}
