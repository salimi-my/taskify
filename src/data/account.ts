import { db } from '@/lib/db';

export async function getAccountByUserId(userId: string) {
  try {
    const account = await db.account.findUnique({
      where: {
        userId
      }
    });

    return account;
  } catch {
    return null;
  }
}
