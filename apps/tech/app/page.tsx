// Technologies homepage — architecture §4.2. Job: convince a technical
// evaluator you can build and operate production systems. 2026-08-27 "Liquid
// Monochrome" redesign: matte black/white bands, thin DM Sans, the violet
// accent spent only on hover, and exactly two motion families — a
// GlassScrollScene pinned behind the dark hero + intro band, and a
// scroll-driven GlassParticles band behind the architecture statement.
// Everything else stays quiet (Reveal fades only).
// Section flow per spec: value prop → platforms → products → architecture
// credibility → certifications → CTA. Product/platform names verbatim from
// the architecture doc; no invented claims, no placeholder counters.
// Internal routes (/services/*) don't exist yet, so service cards are
// unlinked until those pages ship — no dead links. /products exists; the
// products section links through to it.

import { Button, Footer } from '@amalyte/ui';
import { GlassCard, Reveal } from '@amalyte/motion';
import { TechHeroScene, TechParticleBand } from './TechScenes';

const PRODUCTS = [
  { name: 'Ecom Nexus', category: 'E-commerce' },
  { name: 'Smart CRM', category: 'Customer relationship management' },
  { name: 'Smart ERP', category: 'Enterprise resource planning' },
  { name: 'MS AI Workspace', category: 'AI on the Microsoft stack' },
];

// §4.2: Business Central gets top billing — a Microsoft-tier ERP, not to be
// flattened onto the same shelf as the open-source implementations.
const PLATFORMS = [
  'Microsoft — Azure · Dynamics 365 Business Central · Microsoft 365',
  'Odoo',
  'ERPNext',
  'Bitrix24',
  'Tranquil',
];

const SERVICES = [
  { name: 'Custom software', line: 'Laravel, Django, React, Flutter — built to run in production.' },
  { name: 'Automation', line: 'n8n, Make, agentic AI, RPA — workflow engineering, not scripts.' },
  { name: 'ERP & CRM', line: 'Dynamics 365 Business Central, Odoo, ERPNext, Bitrix24 — certified implementations.' },
  { name: 'Cloud', line: 'Azure infrastructure, DevOps, security, managed hosting, Azure AI services.' },
];

export default function Home() {
  return (
    <>
      <main>
        {/* Value prop + platforms — one matte-black band with the scroll
            scene pinned behind it: three glass objects crossfade as the hero
            gives way to the platform list. Falls back to a static poster on
            mobile/reduced-motion; copy stays DOM text either way. */}
        <section data-theme="dark" className="bg-paper text-ink-900">
          <TechHeroScene steps={3}>
            <div className="flex min-h-screen items-center">
              <div className="mx-auto w-full max-w-content px-6 py-24">
                <h1 className="max-w-3xl text-display font-display text-ink-900">
                  Production systems, engineered without hype.
                </h1>
                <p className="mt-6 max-w-2xl text-body-lg text-ink-700">
                  Amalyte Technologies builds and operates the platforms businesses
                  run on — custom software, ERP and CRM, automation, and Azure cloud.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Button variant="solid" href="mailto:contact@amalyte.com">
                    Talk to an engineer
                  </Button>
                  <Button variant="text-link" href="#products">
                    See what we build
                  </Button>
                </div>
              </div>
            </div>

            {/* Platforms — partner depth, BC top billing per §4.2. */}
            <div className="flex min-h-screen items-center">
              <div className="mx-auto w-full max-w-content px-6 py-24">
                <Reveal>
                  <p className="text-caption uppercase tracking-wide text-ink-500">Platforms</p>
                  <ul className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
                    {PLATFORMS.map((p) => (
                      <li key={p} className="text-body-lg font-medium text-ink-700">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </TechHeroScene>
        </section>

        {/* Owned products — light band, liquid-glass cards. */}
        <section id="products" className="mx-auto max-w-content scroll-mt-24 px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="text-h1 font-display text-ink-900">Products</h2>
            <p className="mt-3 max-w-2xl text-body text-ink-700">
              Owned IP, built and operated by Amalyte.
            </p>
            <div className="mt-4">
              <Button variant="text-link" href="/products">
                Browse the products index
              </Button>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <Reveal key={p.name}>
                {/* Hairline border under the glass rim — the rim is white-on-
                    white against the paper background without it. */}
                <GlassCard interactive className="h-full border border-ink-100 p-8">
                  <p className="text-caption uppercase tracking-wide text-ink-500">{p.category}</p>
                  <h3 className="mt-1 text-h3 font-display font-light text-ink-900">{p.name}</h3>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Services — light band, hairline separator. */}
        <section className="border-t border-ink-100">
          <div className="mx-auto max-w-content px-6 py-24 md:py-32">
            <Reveal>
              <h2 className="text-h1 font-display text-ink-900">Services</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <Reveal key={s.name}>
                  <GlassCard interactive className="h-full border border-ink-100 p-8">
                    <h3 className="text-h3 font-display font-light text-ink-900">{s.name}</h3>
                    <p className="mt-3 text-body text-ink-700">{s.line}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture credibility — the dark particle band: droplets morph
            behind the engineering statement as it crosses the viewport. */}
        <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink-900">
          <TechParticleBand />
          <div className="relative z-10 mx-auto max-w-content px-6 py-32 md:py-40">
            <Reveal>
              <p className="max-w-4xl text-h2 font-display font-light text-ink-900">
                We publish real, sanitised architecture diagrams for shipped
                systems — because with technical buyers, showing the work beats
                claiming it.
              </p>
              <p className="mt-6 max-w-2xl text-body text-ink-700">
                Engineering writing and diagrams land here as the site builds out.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Certifications / partner standing. */}
        <section className="border-b border-ink-100">
          <div className="mx-auto max-w-content px-6 py-16 md:py-20">
            <Reveal>
              <p className="text-caption uppercase tracking-wide text-ink-500">
                Partner standing
              </p>
              <p className="mt-4 max-w-3xl text-body-lg font-medium text-ink-700">
                Microsoft CSP · Certified implementations across Odoo, ERPNext,
                and Bitrix24
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA. */}
        <section className="mx-auto max-w-content px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-2xl text-h1 font-display text-ink-900">
              Have a system that needs building — or rescuing?
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button variant="solid" href="mailto:contact@amalyte.com">
                Start a conversation
              </Button>
              <Button variant="text-link" href="https://amalyte.com">
                About Amalyte Group
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer active="tech" />
    </>
  );
}
