import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';

export default {
  providers: [
    Google,
    Github,
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
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (
          !user ||
          !user.password ||
          !(await compare(password, user.password))
        ) {
          return null;
        }

        return user;
      }
    })
  ]
} satisfies NextAuthConfig;
