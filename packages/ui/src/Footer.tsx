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

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Terms', href: 'https://amalyte.com/legal/terms' },
  { label: 'Privacy', href: 'https://amalyte.com/legal/privacy' },
  { label: 'DPDP Notice', href: 'https://amalyte.com/legal/dpdp-notice' },
  { label: 'Contact', href: 'https://amalyte.com/contact' },
];

// Eyebrow-label convention (spec §5.8): uppercase, font-mono, wide tracking.
function EyebrowHeading({ children }: { children: string }) {
  return (
    <h3 className="text-caption font-mono uppercase tracking-wide opacity-70 mb-4">
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
    <footer className={`px-4 py-12 ${className ?? ''}`}>
      <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div>
          <EyebrowHeading>Properties</EyebrowHeading>
          <nav className="flex flex-col gap-3">
            {PROPERTIES.map((p) => (
              <a
                key={p.key}
                href={p.href}
                className={
                  p.key === active
                    ? 'text-accent font-medium text-body'
                    : 'text-body opacity-80 hover:opacity-100 transition-opacity duration-fast ease-amalyte'
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
                className="text-body opacity-80 hover:opacity-100 transition-opacity duration-fast ease-amalyte"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-content mx-auto mt-12 pt-6 border-t border-ink-100 text-caption opacity-60">
        &copy; {new Date().getFullYear()} Amalyte. All rights reserved.
      </div>
    </footer>
  );
}
