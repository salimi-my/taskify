import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';

export const metadata: Metadata = {
  title: 'Taskify — Organize, Prioritize, Conquer Your Tasks!',
  description:
    'Taskify: Powerful project management and task management for streamlined workflows, enhanced collaboration, and boosted productivity.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
