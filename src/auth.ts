import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in'
  },
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production'
});
