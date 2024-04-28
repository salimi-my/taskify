'use server';

import { db } from '@/lib/db';
import { getErrorMessage } from '@/lib/handle-error';

export async function deleteUser(user_ids: string[]) {
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
