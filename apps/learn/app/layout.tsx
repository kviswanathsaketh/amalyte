import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans } from 'next/font/google';
import { TopStrip, ThemeScript } from '@amalyte/ui';
import './globals.css';

// The only typeface in the system (2026-08-21 supersession of Manrope +
// IBM Plex Mono, design spec §2) -- exposed as --font-dm-sans, consumed by
// tokens-core's --font-display/--font-body/--font-mono.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Amalyte Learn — You will ship a working skill, not just watch a video.',
  description: 'Courses, tracks, and corporate training from Amalyte Learn.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-property="learn"
      data-theme="light"
      suppressHydrationWarning
      className={dmSans.variable}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="learn" />
        {children}
      </body>
    </html>
  );
}
