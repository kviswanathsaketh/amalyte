import type { Metadata } from 'next';
import { TopStrip } from '@amalyte/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amalyte Learn — You will ship a working skill, not just watch a video.',
  description: 'Courses, tracks, and corporate training from Amalyte Learn.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-property="learn">
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="learn" />
        {children}
      </body>
    </html>
  );
}
