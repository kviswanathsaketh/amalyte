import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TopStrip } from '@amalyte/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amalyte Technologies — We build the systems that run the business.',
  description: 'Custom software, automation, ERP/CRM, and cloud for Amalyte Technologies.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-property="tech">
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="tech" />
        {children}
      </body>
    </html>
  );
}
