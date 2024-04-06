import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, confirm } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

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

    if (!confirm) {
      return NextResponse.json(
        { success: false, error: 'Confirm password is required.' },
        { status: 400 }
      );
    }

    if (password !== confirm) {
      return NextResponse.json(
        { success: false, error: 'Passwords does not match.' },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists.' },
        { status: 400 }
      );
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json({ success: true, newUser });
  } catch (error) {
    console.log('[REGISTER_POST]', error);

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
