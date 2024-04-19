import * as z from 'zod';

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
