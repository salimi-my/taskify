'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken
} from '@/lib/tokens';

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

  if (!existingUser || !existingUser.name || !existingUser.email) {
    return {
      error: 'Invalid email or password. Please try again.'
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.id);

    await sendVerificationEmail(
      existingUser.name,
      existingUser.email,
      verificationToken.token
    );

    return { success: 'Confirmation email sent. Check your email to verify.' };
  }

  // Check if user with force new password enabled
  if (existingUser.isForceNewPassword) {
    const passwordResetToken = await generatePasswordResetToken(email);

    redirect('/auth/reset-password?token=' + passwordResetToken.token);
  }

  // Check if 2FA enabled
  if (existingUser.email && existingUser.isTwoFactorEnabled) {
    // If verifying 2FA code
    if (code) {
      // Verify the 2FA code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: 'Invalid code.' };
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid code.' };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: 'Code has expired.' };
      }

      // Delete 2FA token
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        // Delete existing 2FA confirmation
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id
          }
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      });
    }
    // If not verifying 2FA code
    else {
      // Send 2FA code mail
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        existingUser.name,
        twoFactorToken.email,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }
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
