// Parent homepage — architecture §4.0. Job: establish the group's scale and
// credibility, then route the visitor to the right division within 15 seconds.
// Section flow per spec: hero → what we do → the four divisions (+ Division
// Router signature module) → proof (partnerships, recognitions) → CTA.
// No placeholder counters or lorem: §4.0's "must fix" list bans the old
// "0 +" modules, so proof is real names only until real numbers exist.
//
// 2026-08-27 "Liquid Monochrome" redesign: matte true black/white bands, thin
// DM Sans, hairline separators, and the group's one violet accent felt only
// on hover/focus/active. Exactly two interaction families besides hover
// micro-states and the Reveal fade: the scroll-driven glass-object
// transitions (HomeScrollScene, behind the dark hero track) and the
// liquid-glass droplet field (HomeParticles, in the dark statement band).

import { Button, Footer } from '@amalyte/ui';
import { GlassCard, Reveal } from '@amalyte/motion';
import { DivisionRouter } from './DivisionRouter';
import { HomeParticles, HomeScrollScene } from './HomeScenes';

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
        {/* Dark hero track — one pinned glass object per band, scrubbed by
            scroll (HomeScrollScene, interaction family #1). data-theme="dark"
            inverts the tokens: matte black paper, true white ink. */}
        <section data-theme="dark" className="bg-paper text-ink-900">
          <HomeScrollScene>
            {/* Hero — dual CTA pattern (spec §5.7): one pill + one
                text-link. */}
            <section className="flex min-h-screen items-center">
              <div className="mx-auto w-full max-w-content px-6">
                <h1 className="max-w-3xl text-display font-display text-ink-900">
                  We turn ideas into things that ship.
                </h1>
                <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                  Amalyte Group is four divisions under one roof — marketing &
                  media, engineering, training, and product innovation — run
                  from Hyderabad, working anywhere.
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
            <section className="flex min-h-screen items-center">
              <div className="mx-auto w-full max-w-content px-6">
                <p className="max-w-3xl text-h1 font-display text-ink-900">
                  One group, four disciplines. Each division stands on its own;
                  together they take an idea from first sketch to shipped
                  product — and make sure people hear about it.
                </p>
              </div>
            </section>

            {/* Thesis — the mark: circle becoming square (parent doc §1). */}
            <section className="flex min-h-screen items-center">
              <div className="mx-auto w-full max-w-content px-6">
                <p className="text-caption uppercase tracking-wide text-ink-500">
                  The thesis
                </p>
                <p className="mt-5 max-w-3xl text-h2 font-display text-ink-900">
                  Our mark is a circle becoming a square — an idea taking the
                  shape of something executable. Studio makes it seen,
                  Technologies makes it run, Learn makes it repeatable, and
                  Labs makes it new.
                </p>
              </div>
            </section>
          </HomeScrollScene>
        </section>

        {/* The four divisions + Division Router. Division cards are v8
            liquid-glass surfaces (GlassCard): monochrome at rest, the violet
            arriving only in the rim light on hover. */}
        <section id="divisions" className="scroll-mt-24">
          <div className="mx-auto max-w-content px-6 py-32 md:py-40">
            <Reveal>
              <h2 className="text-h1 font-display text-ink-900">The divisions</h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {DIVISIONS.map((d) => (
                <Reveal key={d.property}>
                  <a href={d.href} data-property={d.property} className="group block h-full">
                    <GlassCard interactive className="h-full p-8 md:p-10">
                      <div className="mb-4 h-3 w-3 rounded-full border border-ink-300 transition-colors duration-fast ease-amalyte group-hover:border-accent group-hover:bg-accent-soft" />
                      <p className="text-caption uppercase tracking-wide text-ink-500">{d.role}</p>
                      <h3 className="mt-1 text-h3 font-display text-ink-900">
                        Amalyte {d.name}
                      </h3>
                      <p className="mt-3 text-body text-ink-700">{d.line}</p>
                    </GlassCard>
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-20">
              <Reveal>
                <DivisionRouter />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Particle band — interaction family #2: tiny liquid-glass droplets
            forming shapes, morphing as the band travels through the viewport.
            Additive blending needs the matte-black backdrop; the statement is
            real DOM text above the aria-hidden canvas. */}
        <section
          data-theme="dark"
          className="relative min-h-[120vh] overflow-hidden bg-paper text-ink-900"
        >
          <HomeParticles className="absolute inset-0" />
          <div className="relative z-10 mx-auto flex min-h-[120vh] max-w-content items-center px-6">
            <p className="max-w-3xl text-h1 font-display text-ink-900">
              Marketing & media, engineering, training, and product
              innovation — run from Hyderabad, working anywhere.
            </p>
          </div>
        </section>

        {/* Proof — real partnerships and recognitions only (§4.0 must-fix
            bans placeholder counters). Hairline frame, matte white. */}
        <section className="border-y border-ink-100">
          <div className="mx-auto max-w-content px-6 py-24 md:py-32">
            <Reveal>
              <p className="text-caption uppercase tracking-wide text-ink-500">
                Partnerships & recognitions
              </p>
              <ul className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-4">
                {[...PARTNERS, ...RECOGNITIONS].map((name) => (
                  <li key={name} className="text-body-lg text-ink-700">
                    {name}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CTA band. */}
        <section className="mx-auto max-w-content px-6 py-32 md:py-40">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Have something that needs shipping?
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
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
