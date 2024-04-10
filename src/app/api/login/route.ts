import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, code } = body;

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

    // if (!existingUser.emailVerified) {
    //   return NextResponse.json({
    //     success: true,
    //     message: 'Confirmation email sent.'
    //   });
    // }

    return NextResponse.json({ success: true, message: 'Login successful.' });
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
