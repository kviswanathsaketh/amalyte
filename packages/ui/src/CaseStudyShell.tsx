// CaseStudyShell — the shared case-study template used identically across
// Parent's /work/[slug], Studio's /work/[slug], and Labs' /work/[slug]. Eyebrow
// + title + client, hero image, then challenge -> insight -> work in sequence.
// Per the Results Ledger rule (Master Spec's Results Ledger pattern, referenced
// in spec §1): no case study may quietly skip its results section. If `results`
// isn't supplied, a visually distinct "results pending" placeholder renders in
// its place instead of omitting the section.

import type { ReactNode } from 'react';

// Eyebrow-label convention (spec §5.8): uppercase, font-mono, wide tracking.
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-caption font-mono uppercase tracking-wide text-ink-500 mb-6">
      {children}
    </p>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="py-16 border-t border-ink-100">
      <SectionLabel>{label}</SectionLabel>
      <div className="text-body-lg text-ink-900">{children}</div>
    </section>
  );
}

export function CaseStudyShell({
  title,
  client,
  eyebrow,
  heroImage,
  challenge,
  insight,
  work,
  results,
}: {
  title: string;
  client?: string;
  eyebrow: string;
  heroImage: string;
  challenge: ReactNode;
  insight: ReactNode;
  work: ReactNode;
  results?: ReactNode | null;
}) {
  return (
    <article className="max-w-content mx-auto px-6 pb-24">
      <header className="pt-24 pb-16">
        <p className="text-caption font-mono uppercase tracking-wide text-ink-500 mb-4">
          {eyebrow}
        </p>
        <h1 className="text-h1 font-display text-ink-900">{title}</h1>
        {client ? <p className="text-body-lg text-ink-500 mt-4">{client}</p> : null}
      </header>

      <img
        src={heroImage}
        alt={title}
        className="w-full rounded-lg border border-ink-100 shadow-e1 object-cover"
      />

      <Section label="Challenge">{challenge}</Section>
      <Section label="Insight">{insight}</Section>
      <Section label="The Work">{work}</Section>

      {results ? (
        <Section label="Results">{results}</Section>
      ) : (
        <section className="py-16 border-t border-ink-100">
          <SectionLabel>Results</SectionLabel>
          <div className="rounded-lg border border-dashed border-ink-300 p-12 text-center text-body text-ink-500">
            Results pending -- this case study has not yet reported outcomes.
          </div>
        </section>
      )}
    </article>
  );
}
