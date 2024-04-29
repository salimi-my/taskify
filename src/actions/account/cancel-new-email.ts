'use server';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/authentication';
import { unstable_update as update } from '@/auth';
import { getVerificationTokenByUserId } from '@/data/verification-token';

export async function cancelNewEmail() {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const updatedUser = await db.user.update({
    where: {
      id: dbUser.id
    },
    data: {
      tempEmail: null
    }
  });

  update({
    user: {
      tempEmail: null,
      email: updatedUser.tempEmail
    }
  });

  const existingToken = await getVerificationTokenByUserId(dbUser.id);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  return { success: 'Your new email has been canceled.' };
}
