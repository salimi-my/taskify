import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';

import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';

export const metadata: Metadata = {
  title: 'Taskify — Organize, Prioritize, Conquer Your Tasks!',
  description:
    'Taskify: Powerful project management and task management for streamlined workflows, enhanced collaboration, and boosted productivity.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en' suppressHydrationWarning>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <body className={GeistSans.className}>{children}</body>
        </ThemeProvider>
      </html>
    </SessionProvider>
  );
}
