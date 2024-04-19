import NextAuth from 'next-auth';
import type { UserRole } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';
import { getAccountByUserId } from '@/data/account';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      });
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Skip email verification check for OAuth
      if (account?.provider !== 'credentials') {
        return true;
      }

      // Check if user exists
      if (!user || !user.id) {
        return false;
      }

      // Get existing user
      const existingUser = await getUserById(user.id);

      // Prevent unverified email sign in
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      // Check if 2FA enabled
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        // Prevent unconfirmed 2FA sign in
        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete 2FA confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        });
      }

      return true;
    },
    async session({ token, session, trigger, newSession }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.tempEmail = token.tempEmail as string | null;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      if (session.user && trigger === 'update') {
        session.user.name = newSession.name;
        session.user.email = newSession.email;
        session.user.tempEmail = newSession.tempEmail;
        session.user.role = newSession.role;
        session.user.isOAuth = newSession.isOAuth;
        session.user.isTwoFactorEnabled = newSession.isTwoFactorEnabled;
      }

      return session;
    },
    async jwt({ user, token, trigger, session }) {
      if (user) {
        token.sub = user.id;
      }

      if (!user || !token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.tempEmail = existingUser.tempEmail;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      if (trigger === 'update') {
        token.name = session.name;
        token.email = session.email;
        token.tempEmail = session.tempEmail;
        token.role = session.role;
        token.isOAuth = session.isOAuth;
        token.isTwoFactorEnabled = session.isTwoFactorEnabled;
      }

      return token;
    }
  },
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production'
});
