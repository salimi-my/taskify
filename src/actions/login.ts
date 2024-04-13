'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes';
import { generateVerificationToken } from '@/lib/tokens';

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null
) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.id) {
    return {
      error: 'User does not exist.'
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.id);

    return { success: 'Confirmation email sent. Check your email to verify.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_SIGNIN_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Incorrect email or password.'
          };
        default:
          return {
            error: 'Uh oh! Something went wrong.'
          };
      }
    }
    throw error;
  }
}
