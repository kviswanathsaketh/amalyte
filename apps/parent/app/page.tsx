export default function Home() {
  return (
    <main className="max-w-content mx-auto px-6 py-24">
      <h1 className="text-display font-display text-ink-900">
        We turn ideas into things that ship.
      </h1>
      <p className="text-body-lg text-ink-700 mt-6 max-w-2xl">
        Placeholder hero — real copy, mark-morph animation, and division router
        (spec §4.0) land in Phase 1–2 build work. This page exists to prove the
        pipeline: tokens → Tailwind → rendered page, end to end.
      </p>
      <div className="mt-12 flex gap-4 flex-wrap">
        {['studio', 'tech', 'learn', 'labs'].map((division) => (
          <div
            key={division}
            data-property={division}
            className="rounded-lg border border-ink-300 px-5 py-4"
          >
            <div className="w-3 h-3 rounded-full bg-accent mb-2" />
            <span className="text-caption text-ink-500 uppercase tracking-wide">
              {division}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
