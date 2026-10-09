// TopStrip — the persistent property switcher + account-state bar (spec §3.7).
// Identical markup on every property. Liquid Monochrome styling: a quiet matte
// paper strip with a hairline bottom separator, thin caption-size links, and
// the violet accent appearing only on hover/focus-visible.
//
// This is deliberately the first component built: it's the one piece of UI
// every app shares from day one, and it's the visible proof that SSO state
// (once Keycloak/Entra are wired in) is shared silently across subdomains.

import { ThemeToggle } from './ThemeToggle';

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
    <div className="h-8 bg-paper text-ink-900 text-caption flex items-center justify-between px-6 border-b border-ink-100">
      <nav className="flex items-center gap-6">
        {PROPERTIES.map((p) => (
          <a
            key={p.key}
            href={p.href}
            className={
              p.key === active
                ? 'text-ink-900 font-medium'
                : 'text-ink-500 hover:text-accent transition-colors duration-base ease-amalyte'
            }
          >
            {p.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-6">
        <ThemeToggle />
        {isAuthenticated ? (
          <a
            href="https://amalyte.com/account"
            className="text-ink-500 hover:text-accent transition-colors duration-base ease-amalyte"
          >
            {accountName ?? 'Account'}
          </a>
        ) : (
          <a
            href="https://id.amalyte.com/login"
            className="text-ink-500 hover:text-accent transition-colors duration-base ease-amalyte"
          >
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
