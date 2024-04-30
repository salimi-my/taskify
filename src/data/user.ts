import { db } from '@/lib/db';

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id
      }
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmailExcludeOwner(email: string, id: string) {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        id: {
          not: id
        }
      }
    });

    return user;
  } catch {
    return null;
  }
}
