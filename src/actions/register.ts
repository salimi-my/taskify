'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { name, email, password } = validatedFields.data;

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
      password: hashedPassword
    }
  });

  if (!newUser || !newUser.id) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  const verificationToken = await generateVerificationToken(newUser.id);

  return {
    success: 'Sign up successful. Check your email to verify.'
  };
}
