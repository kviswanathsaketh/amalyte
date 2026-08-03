// Card — the two card surfaces used across every property: a plain neutral-chrome
// 'flat' card (spec §10.1) and a 'glass' card that wraps @amalyte/motion's shared
// liquid-glass primitive (spec §5.3). Card itself owns no glass rendering logic --
// that lives once in @amalyte/motion and is reused here so every property gets the
// identical, locked v8 glass construction.

import type { ReactNode } from 'react';
import { GlassCard } from '@amalyte/motion';

type CardVariant = 'flat' | 'glass';

export function Card({
  variant,
  className,
  children,
}: {
  variant: CardVariant;
  className?: string;
  children: ReactNode;
}) {
  if (variant === 'glass') {
    return <GlassCard className={className}>{children}</GlassCard>;
  }

  return (
    <div
      className={`bg-paper border border-ink-100 rounded-lg shadow-e1 p-6 text-ink-900 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
