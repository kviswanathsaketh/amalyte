import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TopStrip } from '@amalyte/ui';
import './globals.css';

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
    <html lang="en" data-property="parent">
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="parent" />
        {children}
      </body>
    </html>
  );
}
