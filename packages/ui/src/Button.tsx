'use client';

// Button — the primary/secondary CTA vocabulary in the Liquid Monochrome
// language.
// Liquid Monochrome: every variant rests in matte monochrome (black on light,
// white on dark) and spends the violet accent only on hover/focus-visible.
// 'solid' and 'outline' are pill-shaped primary actions; 'text-link' is the
// quiet secondary half of the "dual CTA pattern" -- pair a solid/outline pill
// with a text-link, never two competing buttons -- with a thin 1px underline
// that slides in on hover.

import type { MouseEventHandler, ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePressSpring } from '@amalyte/motion';

type ButtonVariant = 'solid' | 'outline' | 'text-link';

// 44px minimum touch target on every variant (min-h-11 = 44px on the 4px scale).
const BASE =
  'inline-flex items-center justify-center min-h-11 font-medium text-body transition-all duration-base ease-amalyte focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: `${BASE} gap-2 px-6 rounded-full bg-ink-900 text-paper hover:bg-accent hover:text-accent-contrast hover:shadow-[0_8px_30px_var(--accent-glow)]`,
  outline: `${BASE} gap-2 px-6 rounded-full border border-ink-300 text-ink-900 bg-transparent hover:border-accent hover:text-accent hover:bg-accent-soft`,
  'text-link': `${BASE} group gap-1 text-ink-900 hover:text-accent`,
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
        <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-base after:ease-amalyte after:content-[''] group-hover:after:scale-x-100">
          {children}
        </span>
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
