import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetProps {
  name: string | null;
  baseUrl: string | undefined;
  resetLink: string;
}

export default function PasswordReset({
  name,
  baseUrl,
  resetLink
}: PasswordResetProps) {
  return (
    <Html>
      <Head>
        <title>Password Reset</title>
      </Head>
      <Preview>Reset your Taskify account password</Preview>
      <Tailwind>
        <Body className='bg-white text-gray-900 font-sans'>
          <Container className='max-w-[480px] my-0 mx-auto pt-5 pb-12 px-0'>
            <Link href={baseUrl} className='flex items-center text-gray-800'>
              <Img
                src={`${baseUrl}/static/taskify-logo.png`}
                width='32'
                height='32'
                className='mr-2'
                alt='Taskify'
              />
              <Text className='text-2xl font-bold m-0 text-[#2563eb]'>
                Taskify
              </Text>
            </Link>

            <Text className='text-xl'>
              Hi <strong>{typeof name === 'string' ? name : 'User'}</strong>,
              your account has requested for password change.
            </Text>

            <Section className='p-6 border-solid border border-gray-300 rounded-md text-center'>
              <Text className='m-0 mb-3 text-left'>
                Greeting from <strong>Taskify</strong>!
              </Text>
              <Text className='m-0 mb-3 text-left'>
                Someone recently requested a password change for your Taskify
                account. If this was you, please click the button below to set a
                new password.
              </Text>

              <Button
                href={resetLink}
                className='text-sm font-semibold bg-[#2563eb] rounded-md text-white py-2 px-6'
              >
                Reset Password
              </Button>

              <Text className='m-0 my-3 text-left'>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
            </Section>

            <Text className='text-gray-500 text-xs text-center mt-5'>
              <Link
                href={baseUrl}
                className='text-gray-500 font-semibold underline underline-offset-2'
              >
                Taskify
              </Link>
              ・ Your one stop solution for task management
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
