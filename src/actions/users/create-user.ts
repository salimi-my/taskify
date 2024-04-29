'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { CreateUserSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';

export async function createUser(values: z.infer<typeof CreateUserSchema>) {
  const validatedFields = CreateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { name, email, password, role, isForceNewPassword, isEmailVerified } =
    validatedFields.data;

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: 'Email is already in use.'
    };
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
      isForceNewPassword,
      emailVerified: isEmailVerified ? new Date() : null
    }
  });

  if (!newUser || !newUser.name || !newUser.email) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  if (!isEmailVerified) {
    const verificationToken = await generateVerificationToken(newUser.id);

    await sendVerificationEmail(
      newUser.name,
      newUser.email,
      verificationToken.token
    );
  }

  return {
    success: 'New user successfully created.'
  };
}
