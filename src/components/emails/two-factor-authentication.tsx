import {
  Body,
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

interface TwoFactorAuthenticationProps {
  name: string | null;
  baseUrl: string | undefined;
  token: string;
}

export default function TwoFactorAuthentication({
  name,
  baseUrl,
  token
}: TwoFactorAuthenticationProps) {
  return (
    <Html>
      <Head>
        <title>Two Factor Authentication</title>
      </Head>
      <Preview>
        Enter the following code to finish signing into your account
      </Preview>
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
              continue your account sign in by entering the following code.
            </Text>

            <Section className='p-6 border-solid border border-gray-300 rounded-md text-center'>
              <Text className='m-0 mb-3 text-left'>
                Greeting from <strong>Taskify</strong>!
              </Text>
              <Text className='m-0 mb-3 text-left'>
                Someone recently try to sign in to your Taskify account. If this
                was you, please use below code to continue sign in.
              </Text>

              <Text className='inline-flex py-2 px-5 bg-zinc-100 rounded text-center font-bold text-xl'>
                {token}
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
