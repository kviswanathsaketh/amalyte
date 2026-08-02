import type { Metadata } from 'next';
import { TopStrip } from '@amalyte/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amalyte Labs — Where imagination meets manufacturing.',
  description: 'Product design, prototyping, and innovation from Amalyte Labs.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-property="labs">
      <body className="bg-paper text-ink-900 font-body antialiased">
        <TopStrip active="labs" />
        {children}
      </body>
    </html>
  );
}
