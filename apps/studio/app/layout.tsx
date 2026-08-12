import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TopStrip } from '@amalyte/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amalyte Studio — We design perception.',
  description: 'Brand, campaigns, content, and media for Amalyte Studio.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-property="studio">
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="studio" />
        {children}
      </body>
    </html>
  );
}
