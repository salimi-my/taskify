'use client';

import * as z from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Social } from '@/components/auth/social';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const urlError =
    searchParams.get('error') === 'CredentialsSignin'
      ? 'Invalid email or password.'
      : searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Invalid OAuth Account.'
      : searchParams.get('error') !== '' && searchParams.get('error') !== null
      ? 'Uh oh! Something went wrong.'
      : '';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError('Uh oh! Something went wrong.'));
    });
  };

  return (
    <>
      <div className='grid gap-2 text-start'>
        <h1 className='text-3xl font-bold'>Sign in</h1>
        <p className='text-balance text-muted-foreground'>
          to continue to your account
        </p>
      </div>
      <FormError className='mb-2' message={error || urlError} />
      <FormSuccess className='mb-2' message={success} />
      <Social />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 -mt-1'
        >
          {/* Display form for 2FA */}
          {showTwoFactor && (
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication Code</FormLabel>
                  <FormControl>
                    <InputOTP autoFocus maxLength={6} {...field}>
                      <InputOTPGroup className='w-full grid grid-cols-6'>
                        <InputOTPSlot className='w-full h-14' index={0} />
                        <InputOTPSlot className='w-full h-14' index={2} />
                        <InputOTPSlot className='w-full h-14' index={1} />
                        <InputOTPSlot className='w-full h-14' index={3} />
                        <InputOTPSlot className='w-full h-14' index={4} />
                        <InputOTPSlot className='w-full h-14' index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the 6-digit code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Display form for no 2FA */}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='email@example.com'
                        autoComplete='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <div className='flex items-center justify-between py-[5px]'>
                      <FormLabel>Password</FormLabel>
                      <Button variant='link' className='p-0 h-0' asChild>
                        <Link href='/auth/forgot-password'>
                          Forgot password?
                        </Link>
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            disabled={isPending}
            type='submit'
            variant='default'
            size='lg'
            className='mt-4'
          >
            {isPending && (
              <>
                <Loader2 className='animate-spin mr-2' size={18} />
                Signing in...
              </>
            )}
            {!isPending && <>Sign in</>}
          </Button>
          <p className='text-sm font-light text-gray-500 dark:text-gray-400 mt-1'>
            Don&apos;t have an account yet?
            <Button variant='link' className='ml-1 px-0' asChild>
              <Link href='/auth/sign-up' title='Sign up'>
                Sign up
              </Link>
            </Button>
          </p>
        </form>
      </Form>
    </>
  );
}
