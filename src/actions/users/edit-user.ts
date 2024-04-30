'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { EditUserSchema } from '@/schemas';
import { sendVerificationEmail } from '@/lib/mail';
import { unstable_update as update } from '@/auth';
import { currentUser } from '@/lib/authentication';
import { generateVerificationToken } from '@/lib/tokens';
import { getUserById, getUserByEmailExcludeOwner } from '@/data/user';

export async function editUser(values: z.infer<typeof EditUserSchema>) {
  const loggedInUser = await currentUser();

  if (!loggedInUser || !loggedInUser.id) {
    return {
      error: 'You are not authorized to edit this user.'
    };
  }

  const validatedFields = EditUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const {
    id,
    name,
    email,
    password,
    role,
    isForceNewPassword,
    isEmailVerified
  } = validatedFields.data;

  const dbUser = await getUserById(id);

  if (!dbUser) {
    return {
      error: 'User not found.'
    };
  }

  let hashedPassword = undefined;
  if (!!password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const existingEmail = await getUserByEmailExcludeOwner(email, id);

  if (existingEmail) {
    return {
      error: 'Email is already in use. Please try other email.'
    };
  }

  const updatedUser = await db.user.update({
    where: {
      id
    },
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      isForceNewPassword,
      emailVerified: isEmailVerified ? new Date() : null
    }
  });

  if (!updatedUser || !updatedUser.name || !updatedUser.email) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  if (!isEmailVerified) {
    const verificationToken = await generateVerificationToken(updatedUser.id);

    await sendVerificationEmail(
      updatedUser.name,
      updatedUser.email,
      verificationToken.token
    );
  }

  if (loggedInUser.id === updatedUser.id) {
    update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  }

  return {
    success: 'User successfully updated.'
  };
}
