import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { signIn } from '@/auth';
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, code, callbackUrl } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email does not exist.' },
        { status: 400 }
      );
    }

    if (!existingUser.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent.'
      });
    }

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_SIGNIN_REDIRECT
      });
    } catch (error) {
      let message;

      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            message = 'Incorrect email or password.';
          default:
            message = 'Oops! Something went wrong.';
        }
      }

      return NextResponse.json(
        { success: false, error: message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log('[LOGIN_POST]', error);

    let message;

    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
