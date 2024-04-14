import { Resend } from 'resend';
import EmailVerification from '@/components/emails/email-verification';

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl = process.env.APP_URL;

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
