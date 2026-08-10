'use client';

// Button — the primary/secondary CTA vocabulary from the Infosys reference
// (spec §5.7) applied through the neutral-chrome-with-surgical-accent rule
// (spec §10.1): 'solid' and 'outline' are pill-shaped primary actions that
// spend the accent color; 'text-link' is the underlined secondary half of
// the "dual CTA pattern" -- pair a solid/outline pill with a text-link,
// never two competing buttons -- and stays neutral chrome, not accent.

import type { MouseEventHandler, ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePressSpring } from '@amalyte/motion';

type ButtonVariant = 'solid' | 'outline' | 'text-link';

// 44px minimum touch target on every variant (min-h-11 = 44px on the 4px scale).
const BASE = 'inline-flex items-center justify-center min-h-11 font-medium text-body transition-colors duration-fast ease-amalyte';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: `${BASE} gap-2 px-6 rounded-full bg-accent text-accent-contrast hover:opacity-90`,
  outline: `${BASE} gap-2 px-6 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-contrast`,
  'text-link': `${BASE} gap-1 text-ink-900 underline underline-offset-4 hover:text-accent`,
};

export function Button({
  variant,
  href,
  onClick,
  children,
}: {
  variant: ButtonVariant;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  children: ReactNode;
}) {
  const className = VARIANT_CLASSES[variant];
  // Text-links have no filled/outlined surface to press, so a scale-down
  // reads as odd -- reserve the press spring for the two pill variants.
  const pressSpring = usePressSpring(variant === 'text-link' ? 1 : 0.97);

  const content =
    variant === 'text-link' ? (
      <>
        <span>{children}</span>
        <span aria-hidden="true">&rarr;</span>
      </>
    ) : (
      children
    );

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} className={className} {...pressSpring}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} className={className} {...pressSpring}>
      {content}
    </motion.button>
  );
}
