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

interface EmailVerificationProps {
  name: string | null;
  baseUrl: string | undefined;
  verifyLink: string;
}

export function EmailVerification({
  name,
  baseUrl,
  verifyLink
}: EmailVerificationProps) {
  return (
    <Html>
      <Head>
        <title>Email Verification</title>
      </Head>
      <Preview>Verify your Taskify account email address</Preview>
      <Tailwind>
        <Body className='bg-white text-gray-900 font-sans'>
          <Container className='max-w-[480px] my-0 mx-auto pt-5 pb-12 px-0'>
            <Link href={baseUrl} className='flex items-center text-gray-800'>
              <Img
                src={`${baseUrl}/taskify-logo.png`}
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
              there is an account registered with your email.
            </Text>

            <Section className='p-6 border-solid border border-gray-300 rounded-md text-center'>
              <Text className='m-0 mb-3 text-left'>
                Greeting from <strong>Taskify</strong>!
              </Text>
              <Text className='m-0 mb-3 text-left'>
                A Taskify account was registered with your email address. We
                want to make sure it&apos;s really you. Please click the button
                below to verify your email address.
              </Text>

              <Button
                href={verifyLink}
                className='text-sm font-semibold bg-[#2563eb] rounded-md text-white py-2 px-6'
              >
                Verify
              </Button>
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
