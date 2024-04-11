import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserByEmail } from '@/data/user';

export default {
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      authorize: async (credentials) => {
        if (
          !credentials.email ||
          !credentials.password ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }

        const user = await getUserByEmail(credentials.email);

        if (
          !user ||
          !user.password ||
          !(await compare(credentials.password, user.password))
        ) {
          return null;
        }

        return user;
      }
    })
  ]
} satisfies NextAuthConfig;
