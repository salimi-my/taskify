import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { getVerificationTokenByUserId } from '@/data/verification-token';

export async function generateVerificationToken(
  userId: string,
  isUpdateEmail: boolean = false
) {
  const token = uuidv4();

  // Expire the token in one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByUserId(userId);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      userId,
      token,
      isUpdateEmail,
      expires
    }
  });

  return verficationToken;
}
