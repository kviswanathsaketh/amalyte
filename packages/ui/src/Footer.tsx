// Footer — the group-wide footer shared identically across all five properties:
// links to every property (same shape as TopStrip's property switcher, copied
// locally since TopStrip doesn't export its array), a legal/contact row, and a
// copyright line. Neutral chrome throughout (spec §10.1) -- pass `className` to
// set bg-ink-900/text-paper or bg-paper/text-ink-900 depending on the theme
// context the consuming app renders this in.

type Property = 'parent' | 'studio' | 'tech' | 'learn' | 'labs';

const PROPERTIES: { key: Property; label: string; href: string }[] = [
  { key: 'parent', label: 'Amalyte', href: 'https://amalyte.com' },
  { key: 'studio', label: 'Studio', href: 'https://studio.amalyte.com' },
  { key: 'tech', label: 'Technologies', href: 'https://tech.amalyte.com' },
  { key: 'learn', label: 'Learn', href: 'https://learn.amalyte.com' },
  { key: 'labs', label: 'Labs', href: 'https://labs.amalyte.com' },
];

// TEMPORARY (2026-08-22): /legal/* and /contact don't exist yet -- linking to
// them would 404 on the live domain. Down to a single working mailto until
// those pages ship; restore the full Terms/Privacy/DPDP/Contact set then.
const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Contact', href: 'mailto:contact@amalyte.com' },
];

// Eyebrow-label convention (spec §5.8): uppercase, font-mono, wide tracking.
function EyebrowHeading({ children }: { children: string }) {
  return (
    <h3 className="text-caption font-mono uppercase tracking-wide text-ink-500 mb-4">
      {children}
    </h3>
  );
}

export function Footer({
  active,
  className,
}: {
  active: Property;
  className?: string;
}) {
  return (
    <footer className={`px-6 pt-32 pb-16 border-t border-ink-100 ${className ?? ''}`}>
      <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16">
        <div>
          <EyebrowHeading>Properties</EyebrowHeading>
          <nav className="flex flex-col gap-3">
            {PROPERTIES.map((p) => (
              <a
                key={p.key}
                href={p.href}
                className={
                  p.key === active
                    ? 'text-ink-900 font-medium text-body'
                    : 'text-body text-ink-500 hover:text-accent transition-colors duration-base ease-amalyte'
                }
              >
                {p.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <EyebrowHeading>Legal</EyebrowHeading>
          <nav className="flex flex-col gap-3">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-body text-ink-500 hover:text-accent transition-colors duration-base ease-amalyte"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-content mx-auto mt-24 pt-8 border-t border-ink-100 text-caption text-ink-500">
        &copy; {new Date().getFullYear()} Amalyte. All rights reserved.
      </div>
    </footer>
  );
}
