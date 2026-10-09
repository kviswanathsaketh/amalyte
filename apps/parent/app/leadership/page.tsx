// Parent /leadership — architecture §4.0, parent doc §5. Named, real people
// only: this page replaces the old site's placeholder team block, so nothing
// invented goes here. Only two names are documented (parent doc §5:
// "Chinmai Reddy, CEO; Saketh, founder") — the page ships with exactly those
// two, and full bios stay pending until the leadership team supplies them
// (tracked as a content input in the backlog tracker). No stock headshots,
// no fabricated histories — an honest short page beats a padded one.

import type { Metadata } from 'next';
import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { Reveal } from '@amalyte/motion';

export const metadata: Metadata = {
  title: 'Leadership — Amalyte Group',
  description:
    'The leadership of Amalyte Group / Amalyte LLP — the people accountable for the four divisions.',
};

const LEADERS = [
  {
    name: 'Chinmai Reddy',
    role: 'Chief Executive Officer',
    responsibility:
      'Leads Amalyte LLP and the group’s four divisions — Studio, Technologies, Learn, and Labs.',
  },
  {
    name: 'Saketh',
    role: 'Founder',
    responsibility:
      'Founded Amalyte and sets the group’s technical and product direction.',
  },
];

export default function Leadership() {
  return (
    <>
      <main>
        {/* Header. */}
        <section className="mx-auto max-w-content px-6 pb-20 pt-28 md:pb-24 md:pt-40">
          <h1 className="max-w-3xl text-display font-display text-ink-900">
            Leadership
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
            Amalyte Group is led by a small, named team. Full bios publish
            ahead of launch — this page only ever lists real people.
          </p>
        </section>

        {/* The leaders — hairline panels, thin type, no boxes. */}
        <section className="mx-auto max-w-content px-6 pb-28 md:pb-36">
          <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
            {LEADERS.map((leader) => (
              <Reveal key={leader.name}>
                <div className="border-t border-ink-100 pt-8">
                  <h2 className="text-h2 font-display text-ink-900">{leader.name}</h2>
                  <p className="mt-2 text-caption uppercase tracking-wide text-ink-500">
                    {leader.role}
                  </p>
                  <p className="mt-5 max-w-md text-body text-ink-700">{leader.responsibility}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA — dark inspo band (glass capsules) with a veil for
            contrast. */}
        <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (same as studio/home); runtime unaffected. */}
          <Image
            src="/inspo/glass-capsules.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto max-w-content px-6 py-32 md:py-48">
            <Reveal>
              <h2 className="max-w-2xl text-h1 font-display text-ink-900">
                Working with us starts with a conversation.
              </h2>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Button variant="solid" href="mailto:contact@amalyte.com">
                  Contact the group
                </Button>
                <Button variant="text-link" href="/about">
                  About Amalyte
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer active="parent" />
    </>
  );
}
