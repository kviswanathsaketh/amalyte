import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans } from 'next/font/google';
import { TopStrip, ThemeScript } from '@amalyte/ui';
import { ScrollProvider } from '@amalyte/motion';
import './globals.css';

// The only typeface in the system (2026-08-21 supersession of Manrope +
// IBM Plex Mono, design spec §2) -- exposed as --font-dm-sans, consumed by
// tokens-core's --font-display/--font-body/--font-mono.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
});

// data-property="parent" scopes the accent token (packages/tokens/tokens.css).
// Each division app sets its own value here — that's the only per-property
// change this file needs.
export const metadata: Metadata = {
  title: 'Amalyte — Making ideas alive.',
  description:
    'Amalyte Group — marketing & media, technology, learning, and product innovation, under one roof.',
  robots: { index: true, follow: true }, // explicit: previous WP site shipped noindex,nofollow by mistake
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-property="parent"
      data-theme="light"
      suppressHydrationWarning
      className={dmSans.variable}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-paper text-ink-900 font-body antialiased">
        <ScrollProvider>
          <TopStrip active="parent" />
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
