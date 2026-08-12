// Parent homepage — architecture §4.0. Job: establish the group's scale and
// credibility, then route the visitor to the right division within 15 seconds.
// Section flow per spec: hero → what we do → the four divisions (+ Division
// Router signature module) → proof (partnerships, recognitions) → CTA.
// No placeholder counters or lorem: §4.0's "must fix" list bans the old
// "0 +" modules, so proof is real names only until real numbers exist.

import { Button, Card, Footer } from '@amalyte/ui';
import { FluidBlob, Reveal } from '@amalyte/motion';
import { DivisionRouter } from './DivisionRouter';

const DIVISIONS = [
  {
    property: 'studio',
    name: 'Studio',
    role: 'Marketing & media',
    line: 'Brand, campaigns, and film. Show, then explain.',
    href: 'https://studio.amalyte.com',
  },
  {
    property: 'tech',
    name: 'Technologies',
    role: 'Engineering',
    line: 'Platforms and products, engineered without hype.',
    href: 'https://tech.amalyte.com',
  },
  {
    property: 'learn',
    name: 'Learn',
    role: 'Training',
    line: 'Outcome-led programs for teams that need to ship.',
    href: 'https://learn.amalyte.com',
  },
  {
    property: 'labs',
    name: 'Labs',
    role: 'Product innovation',
    line: 'From prototype to production, hardware and software.',
    href: 'https://labs.amalyte.com',
  },
];

const PARTNERS = ['Microsoft', 'Bitrix24', 'Odoo', 'ERPNext'];
const RECOGNITIONS = ['MSME registered', 'Startup India recognised'];

export default function Home() {
  return (
    <>
      <main>
        {/* Hero — metallic rose-gold blob (design spec §5.5) behind the
            headline; dual CTA pattern (spec §5.7): one pill + one text-link. */}
        <section className="relative overflow-hidden">
          <FluidBlob
            metallic
            className="pointer-events-none absolute -right-40 -top-24 h-[36rem] w-[36rem] opacity-70"
          />
          <div className="relative mx-auto max-w-content px-6 pb-24 pt-28 md:pt-36">
            <h1 className="max-w-3xl text-display font-display text-ink-900">
              We turn ideas into things that ship.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
              Amalyte Group is four divisions under one roof — marketing &
              media, engineering, training, and product innovation — run from
              Hyderabad, working anywhere.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="#divisions">
                Find your division
              </Button>
              <Button variant="text-link" href="mailto:contact@amalyte.com">
                Talk to us
              </Button>
            </div>
          </div>
        </section>

        {/* What we do — sells the organisation, not services (§4.0). */}
        <section className="mx-auto max-w-content px-6 py-20">
          <Reveal>
            <p className="max-w-3xl text-h2 font-display text-ink-900">
              One group, four disciplines. Each division stands on its own;
              together they take an idea from first sketch to shipped product —
              and make sure people hear about it.
            </p>
          </Reveal>
        </section>

        {/* The four divisions + Division Router. */}
        <section id="divisions" className="mx-auto max-w-content scroll-mt-24 px-6 py-20">
          <Reveal>
            <h2 className="text-h1 font-display text-ink-900">The divisions</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {DIVISIONS.map((d) => (
              <Reveal key={d.property}>
                <a href={d.href} data-property={d.property} className="group block h-full">
                  <Card variant="flat" className="h-full transition-shadow duration-base ease-amalyte group-hover:shadow-e3">
                    <div className="mb-3 h-3 w-3 rounded-full bg-accent" />
                    <p className="text-caption uppercase tracking-wide text-ink-500">{d.role}</p>
                    <h3 className="mt-1 text-h3 font-display text-ink-900">
                      Amalyte {d.name}
                    </h3>
                    <p className="mt-3 text-body text-ink-700">{d.line}</p>
                  </Card>
                </a>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Reveal>
              <DivisionRouter />
            </Reveal>
          </div>
        </section>

        {/* Proof — real partnerships and recognitions only (§4.0 must-fix
            bans placeholder counters). */}
        <section className="border-y border-ink-100 bg-ink-100/30">
          <div className="mx-auto max-w-content px-6 py-16">
            <Reveal>
              <p className="text-caption uppercase tracking-wide text-ink-500">
                Partnerships & recognitions
              </p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
                {[...PARTNERS, ...RECOGNITIONS].map((name) => (
                  <li key={name} className="text-body-lg font-medium text-ink-700">
                    {name}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CTA band. */}
        <section className="mx-auto max-w-content px-6 py-24">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Have something that needs shipping?
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:contact@amalyte.com">
                Start a conversation
              </Button>
              <Button variant="text-link" href="#divisions">
                Browse the divisions
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="parent" />
    </>
  );
}
