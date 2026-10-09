// Learn homepage — the training division, outcome-led programs. Lighter
// rhythm than Studio (2026-08-27 "Liquid Monochrome" brief): a light hero
// first, then a matte-black image band (glass-panels.jpg), a light
// "how a program runs" band as hairline list rows, then the dark particle
// band (GlassParticles, scroll-driven) carrying the outcome statement, and a
// minimal CTA. No lorem, no fake stats.

import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { Reveal } from '@amalyte/motion';
import { Particles } from './Scenes';

const PROGRAM_STEPS = [
  {
    title: 'Diagnose',
    copy: 'We start from the work your team actually ships, not a syllabus — and find the gap between the two.',
  },
  {
    title: 'Build',
    copy: 'Short, live working sessions. Every exercise is a real task from your backlog, done together.',
  },
  {
    title: 'Ship',
    copy: 'The program ends when the skill is in production — a shipped feature, a running pipeline, a working skill.',
  },
];

export default function Home() {
  return (
    <>
      <main>
        {/* Light hero — Learn leads with the promise, not the spectacle. */}
        <section className="mx-auto max-w-content px-6 pb-24 pt-28 md:pt-36">
          <Reveal>
            <p className="text-caption font-mono uppercase tracking-wide text-ink-500">
              Amalyte Learn — Training
            </p>
            <h1 className="mt-6 max-w-3xl text-display font-display text-ink-900">
              You will ship a working skill, not just watch a video.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
              Outcome-led programs for teams that need to ship. No certificates
              for attendance — the deliverable is the work itself.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:learn@amalyte.com">
                Plan a program
              </Button>
            </div>
          </Reveal>
        </section>

        {/* Matte-black image band — full-bleed glass panels under a black
            veil, a breath of dark between the two light bands. */}
        <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (same as parent/about); runtime unaffected. */}
          <Image
            src="/inspo/glass-panels.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
          <div className="relative mx-auto max-w-content px-6 py-32 md:py-40">
            <Reveal>
              <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                Skills are built like glass: heat, pressure, patience.
              </h2>
              <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                We train small cohorts on real work, in short loops, until the
                new skill holds its shape on its own.
              </p>
            </Reveal>
          </div>
        </section>

        {/* How a program runs — hairline list rows on matte white. */}
        <section className="border-b border-ink-100">
          <div className="mx-auto max-w-content px-6 py-24 md:py-32">
            <Reveal>
              <h2 className="text-h1 font-display text-ink-900">
                How a program runs
              </h2>
            </Reveal>
            <ul className="mt-12">
              {PROGRAM_STEPS.map((s) => (
                <li key={s.title} className="border-t border-ink-100 last:border-b">
                  <Reveal>
                    <div className="grid gap-2 py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                      <h3 className="text-h3 font-display text-ink-900">{s.title}</h3>
                      <p className="max-w-2xl text-body text-ink-700">{s.copy}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dark particle band — droplets forming and reforming shapes as the
            section travels through the viewport: the liquid stand-in for a
            skill taking shape. */}
        <section data-theme="dark" className="relative flex min-h-screen items-center overflow-hidden bg-paper text-ink-900">
          <Particles scrollDriven className="absolute inset-0" />
          <div className="relative mx-auto w-full max-w-content px-6 py-32">
            <Reveal>
              <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                Knowledge settles. Skill holds its shape.
              </h2>
              <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                That is the whole bet behind Amalyte Learn — train on the real
                thing, and what remains after the program is capability, not
                notes.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Minimal CTA — solid pill mailto + text-link back to the group. */}
        <section className="mx-auto max-w-content px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              What should your team be able to ship next quarter?
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:learn@amalyte.com">
                Plan a program
              </Button>
              <Button variant="text-link" href="https://amalyte.com">
                Back to Amalyte
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="learn" />
    </>
  );
}
