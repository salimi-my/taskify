import * as z from 'zod';
import { UserRole } from '@prisma/client';

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().email({ message: 'Valid email address is required.' }),
    password: z
      .string()
      .min(8, { message: 'At least 8 characters are required.' }),
    confirm: z
      .string()
      .min(8, { message: 'At least 8 characters are required.' })
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords does not match.',
    path: ['confirm']
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter valid email address.' }),
  password: z.string().min(1, { message: 'Please enter password.' }),
  code: z.optional(z.string())
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Valid email is required.'
  })
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: 'At least 8 characters required.'
    }),
    confirm: z.string().min(8, {
      message: 'At least 8 characters required.'
    })
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords does not match.',
    path: ['confirm']
  });

export const EditProfileSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.'
  }),
  email: z.string().email({
    message: 'Valid email is required.'
  }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  isTwoFactorEnabled: z.boolean()
});

export const EditPasswordSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'At least 8 characters are required.'
    }),
    newPassword: z.string().min(8, {
      message: 'At least 8 characters are required.'
    }),
    confirmPassword: z.string().min(8, {
      message: 'At least 8 characters are required.'
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords does not match.',
    path: ['confirm']
  });

export const UserFilterSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Valid email address is required.' }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  password: z
    .string()
    .min(8, { message: 'At least 8 characters are required.' }),
  isForceNewPassword: z.boolean(),
  isEmailVerified: z.boolean()
});

export const EditUserSchema = z.object({
  id: z.string().min(1, { message: 'ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Valid email address is required.' }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  password: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === null ||
        value.length === 0 ||
        value.length >= 8,
      { message: 'At least 8 characters are required.' }
    ),
  isForceNewPassword: z.boolean(),
  isEmailVerified: z.boolean()
});
