'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { EditProfileSchema } from '@/schemas';
import { unstable_update as update } from '@/auth';
import { sendVerificationEmail } from '@/lib/mail';
import { currentUser } from '@/lib/authentication';
import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail, getUserById } from '@/data/user';

export async function editProfile(values: z.infer<typeof EditProfileSchema>) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  let updateEmail = false;

  if (values.email && values.email !== user.email) {
    updateEmail = true;
  }

  if (updateEmail) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already exist.' };
    }

    const verificationToken = await generateVerificationToken(dbUser.id, true);

    await sendVerificationEmail(
      values.name,
      values.email,
      verificationToken.token
    );
  }

  const updatedUser = await db.user.update({
    where: {
      id: dbUser.id
    },
    data: {
      name: values.name,
      tempEmail: user.isOAuth || !updateEmail ? undefined : values.email,
      role: values.role,
      isTwoFactorEnabled: user.isOAuth ? undefined : values.isTwoFactorEnabled
    }
  });

  await update({
    user: {
      name: updatedUser.name,
      role: updatedUser.role,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled
    }
  });

  return {
    success: !updateEmail
      ? 'Profile successfully updated.'
      : 'Profile successfully updated & verification email sent.'
  };
}
