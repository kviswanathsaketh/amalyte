// Studio homepage — the marketing & media division. Section flow per the
// 2026-08-27 "Liquid Monochrome" brief: matte-black hero scrubbing through
// glass objects (GlassScrollScene pins behind the hero + the following
// manifesto band) -> light capabilities band (GlassCards) -> dark particle
// band (GlassParticles, scroll-driven) -> minimal CTA. No lorem, no fake
// stats — short, real-feeling copy only.

import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { GlassCard, Reveal } from '@amalyte/motion';
import { ScrollScene, Particles } from './Scenes';

const CAPABILITIES = [
  {
    title: 'Brand identity',
    copy: 'Naming, marks, and visual systems built to be recognized from across the room — then documented so they stay that way.',
  },
  {
    title: 'Campaigns',
    copy: 'Launches and always-on campaigns, from the single line everything hangs on to the assets that carry it.',
  },
  {
    title: 'Film & motion',
    copy: 'Product films, title sequences, and motion systems. Show, then explain — never the other way around.',
  },
  {
    title: 'Content systems',
    copy: 'Editorial engines that keep a brand talking after the launch spike: calendars, templates, and the discipline to run them.',
  },
];

export default function Home() {
  return (
    <>
      <main>
        {/* Dark scroll scene — the glass canvas pins behind both the hero and
            the manifesto band, scrubbing through three objects as the reader
            moves between them. Falls back to a static poster on mobile and
            reduced motion. */}
        <ScrollScene
          steps={3}
          className="bg-ink-900"
        >
          <section data-theme="dark" className="flex min-h-screen items-center text-ink-900">
            <div className="mx-auto w-full max-w-content px-6 py-32">
              <p className="text-caption font-mono uppercase tracking-wide text-ink-500">
                Amalyte Studio — Marketing &amp; media
              </p>
              <h1 className="mt-6 max-w-3xl text-display font-display text-ink-900">
                We design perception.
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                Brand, campaigns, and film for companies with something real to
                show. We make the thing people remember, then the system that
                keeps them remembering.
              </p>
            </div>
          </section>

          <section data-theme="dark" className="flex min-h-screen items-center text-ink-900">
            <div className="mx-auto w-full max-w-content px-6 py-32">
              <Reveal>
                <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                  Attention is earned in the first second and kept in the
                  hundredth.
                </h2>
                <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                  That is why we start with how a thing looks in motion, in a
                  feed, at a glance — and only then write the deck about it.
                </p>
              </Reveal>
            </div>
          </section>
        </ScrollScene>

        {/* Light capabilities band — GlassCards on matte white. */}
        <section className="border-t border-ink-100">
          <div className="mx-auto max-w-content px-6 py-24 md:py-32">
            <Reveal>
              <h2 className="text-h1 font-display text-ink-900">What we make</h2>
              <p className="mt-4 max-w-2xl text-body-lg text-ink-700">
                Four disciplines, one standard: work that looks inevitable once
                it exists.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {CAPABILITIES.map((c) => (
                <Reveal key={c.title}>
                  <GlassCard className="h-full p-8">
                    <span className="block">
                      <span className="text-caption font-mono uppercase tracking-wide text-ink-500">
                        {c.title}
                      </span>
                      <span className="mt-3 block text-body text-ink-700">{c.copy}</span>
                    </span>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Dark particle band — liquid-glass droplets morphing through
            shapes, scrubbed by this section's travel through the viewport,
            over a full-bleed inspo photograph under a black veil. */}
        <section data-theme="dark" className="relative flex min-h-screen items-center overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (same as parent/about); runtime unaffected. */}
          <Image
            src="/inspo/glass-capsules.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
          <Particles scrollDriven className="absolute inset-0" />
          <div className="relative mx-auto w-full max-w-content px-6 py-32">
            <Reveal>
              <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                Every impression is a material. We shape it.
              </h2>
              <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                A brand is thousands of small surfaces — a thumbnail, a title
                card, a pause in a film. We treat each one like glass: cut
                once, polished until it disappears.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Minimal CTA — solid pill mailto + text-link back to the group. */}
        <section className="mx-auto max-w-content px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Have something worth looking at?
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:studio@amalyte.com">
                Start a project
              </Button>
              <Button variant="text-link" href="https://amalyte.com">
                Back to Amalyte
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="studio" />
    </>
  );
}
