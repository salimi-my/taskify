'use server';

import * as z from 'zod';
import bcrypt, { compare } from 'bcryptjs';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { EditPasswordSchema } from '@/schemas';
import { unstable_update as update } from '@/auth';
import { currentUser } from '@/lib/authentication';

export async function editPassword(values: z.infer<typeof EditPasswordSchema>) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this.' };
  }

  if (user.isOAuth) {
    return { error: 'You are not authorized to edit this.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser || !dbUser.password) {
    return { error: 'You are not authorized to edit this.' };
  }

  const passwordsMatch = await compare(values.currentPassword, dbUser.password);

  if (!passwordsMatch) {
    return { error: 'Incorrect current password.' };
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(values.newPassword, salt);

  const updatedUser = await db.user.update({
    where: {
      id: dbUser.id
    },
    data: {
      password: hashedPassword
    }
  });

  update({
    user: {
      name: updatedUser.name,
      role: updatedUser.role,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled
    }
  });

  return { success: 'Password successfully updated.' };
}
