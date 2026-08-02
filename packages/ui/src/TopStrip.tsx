// TopStrip — the persistent property switcher + account-state bar (spec §3.7).
// Identical markup on every property; only the active property is highlighted
// via the accent token already scoped by data-property on <html>.
//
// This is deliberately the first component built: it's the one piece of UI
// every app shares from day one, and it's the visible proof that SSO state
// (once Keycloak/Entra are wired in) is shared silently across subdomains.

type Property = 'parent' | 'studio' | 'tech' | 'learn' | 'labs';

const PROPERTIES: { key: Property; label: string; href: string }[] = [
  { key: 'parent', label: 'Amalyte', href: 'https://amalyte.com' },
  { key: 'studio', label: 'Studio', href: 'https://studio.amalyte.com' },
  { key: 'tech', label: 'Technologies', href: 'https://tech.amalyte.com' },
  { key: 'learn', label: 'Learn', href: 'https://learn.amalyte.com' },
  { key: 'labs', label: 'Labs', href: 'https://labs.amalyte.com' },
];

export function TopStrip({
  active,
  isAuthenticated = false,
  accountName,
}: {
  active: Property;
  isAuthenticated?: boolean;
  accountName?: string;
}) {
  return (
    <div className="h-7 bg-ink-900 text-paper text-caption flex items-center justify-between px-4">
      <nav className="flex items-center gap-4">
        {PROPERTIES.map((p) => (
          <a
            key={p.key}
            href={p.href}
            className={
              p.key === active
                ? 'text-accent font-medium'
                : 'text-ink-300 hover:text-paper transition-colors duration-fast ease-amalyte'
            }
          >
            {p.label}
          </a>
        ))}
      </nav>
      <div>
        {isAuthenticated ? (
          <a href="https://amalyte.com/account" className="hover:text-accent">
            {accountName ?? 'Account'}
          </a>
        ) : (
          <a href="https://id.amalyte.com/login" className="hover:text-accent">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
