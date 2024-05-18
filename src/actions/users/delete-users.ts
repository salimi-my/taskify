'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/authentication';
import { getErrorMessage } from '@/lib/handle-error';

export async function deleteUsers(user_ids: string[]) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to delete users.' };
  }

  if (user_ids.includes(user.id)) {
    return { error: 'You cannot delete your own account.' };
  }

  try {
    await db.user.deleteMany({
      where: {
        id: {
          in: user_ids
        }
      }
    });

    return {
      success:
        (user_ids.length > 1 ? 'Users' : 'User') + ' successfully deleted.'
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
