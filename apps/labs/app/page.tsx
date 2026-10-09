// Labs homepage — the product innovation division (hardware + software
// prototyping). Section flow per the 2026-08-27 "Liquid Monochrome" brief,
// varied from Studio and Learn: matte-black hero over a full-bleed inspo
// photograph (glass-shell-fan.png) -> light capabilities band as hairline
// list rows -> dark scroll scene (GlassScrollScene pins behind two
// statement bands) -> minimal CTA. No lorem, no fake stats.

import Image from 'next/image';
import { Button, Footer } from '@amalyte/ui';
import { Reveal } from '@amalyte/motion';
import { ScrollScene } from './Scenes';

const CAPABILITIES = [
  {
    title: 'Industrial design',
    copy: 'Form, materials, and mechanisms for physical products — from the first sketch to something you can hold.',
  },
  {
    title: 'Hardware prototyping',
    copy: 'Electronics, enclosures, and firmware that turn a drawing into a working unit, then into a second, better one.',
  },
  {
    title: 'Software prototyping',
    copy: 'The apps, dashboards, and control layers a product needs — built alongside the hardware, not after it.',
  },
  {
    title: 'Production handoff',
    copy: 'Design for manufacturing, sourcing, and the documentation a factory actually needs to build the thing.',
  },
];

export default function Home() {
  return (
    <>
      <main>
        {/* Dark hero — full-bleed glass shell photograph under a black veil,
            thin display headline over it. */}
        <section data-theme="dark" className="relative flex min-h-screen items-center overflow-hidden bg-paper text-ink-900">
          {/* @ts-ignore -- React 18/19 @types split (same as parent/about); runtime unaffected. */}
          <Image
            src="/inspo/glass-shell-fan.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
          <div className="relative mx-auto w-full max-w-content px-6 py-32">
            <p className="text-caption font-mono uppercase tracking-wide text-ink-500">
              Amalyte Labs — Product innovation
            </p>
            <h1 className="mt-6 max-w-3xl text-display font-display text-ink-900">
              Where imagination meets manufacturing.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
              Hardware and software, prototyped together. We take products from
              the first sketch to the factory floor.
            </p>
          </div>
        </section>

        {/* Light capabilities band — hairline list rows. */}
        <section>
          <div className="mx-auto max-w-content px-6 py-24 md:py-32">
            <Reveal>
              <h2 className="text-h1 font-display text-ink-900">What we build</h2>
              <p className="mt-4 max-w-2xl text-body-lg text-ink-700">
                One team across the whole gap between an idea and a production
                line.
              </p>
            </Reveal>
            <ul className="mt-12">
              {CAPABILITIES.map((c) => (
                <li key={c.title} className="border-t border-ink-100 last:border-b">
                  <Reveal>
                    <div className="grid gap-2 py-8 sm:grid-cols-[16rem_1fr] sm:gap-8">
                      <h3 className="text-h3 font-display text-ink-900">{c.title}</h3>
                      <p className="max-w-2xl text-body text-ink-700">{c.copy}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dark scroll scene — the glass canvas pins behind both bands and
            scrubs between two objects as the reader moves from prototype to
            production. Children stay transparent so the canvas shows through. */}
        <ScrollScene steps={2} className="bg-ink-900">
          <section data-theme="dark" className="flex min-h-screen items-center text-ink-900">
            <div className="mx-auto w-full max-w-content px-6 py-32">
              <Reveal>
                <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                  A prototype is a question made physical.
                </h2>
                <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                  Will it fit in a hand? Survive a drop? Feel inevitable? We
                  build the version that answers — quickly, and honestly.
                </p>
              </Reveal>
            </div>
          </section>

          <section data-theme="dark" className="flex min-h-screen items-center text-ink-900">
            <div className="mx-auto w-full max-w-content px-6 py-32">
              <Reveal>
                <h2 className="max-w-3xl text-h1 font-display text-ink-900">
                  Production is where ideas prove themselves.
                </h2>
                <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                  We stay past the demo — through tolerances, sourcing, and the
                  thousand small decisions between a prototype and a product.
                </p>
              </Reveal>
            </div>
          </section>
        </ScrollScene>

        {/* Minimal CTA — solid pill mailto + text-link back to the group. */}
        <section className="mx-auto max-w-content px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Have a product that needs to exist?
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:labs@amalyte.com">
                Start a prototype
              </Button>
              <Button variant="text-link" href="https://amalyte.com">
                Back to Amalyte
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="labs" />
    </>
  );
}
