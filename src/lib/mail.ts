import { Resend } from 'resend';

import PasswordReset from '@/components/emails/password-reset';
import EmailVerification from '@/components/emails/email-verification';
import TwoFactorAuthentication from '@/components/emails/two-factor-authentication';

const baseUrl = process.env.APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string
) {
  const verifyLink = `${baseUrl}/auth/email-verification?token=${token}`;

  await resend.emails.send({
    from: 'Taskify <confirmation@taskify.salimi.my>',
    to: email,
    subject: 'Email Verification',
    react: EmailVerification({ name, baseUrl, verifyLink })
  });
}

export async function sendPasswordResetEmail(
  name: string | null,
  email: string,
  token: string
) {
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'Taskify <reset@taskify.salimi.my>',
    to: email,
    subject: 'Password Reset',
    react: PasswordReset({ name, baseUrl, resetLink })
  });
}

export async function sendTwoFactorTokenEmail(
  name: string | null,
  email: string,
  token: string
) {
  await resend.emails.send({
    from: 'Taskify <2fa@taskify.salimi.my>',
    to: email,
    subject: 'Two Factor Authentication Code',
    react: TwoFactorAuthentication({ name, baseUrl, token })
  });
}
