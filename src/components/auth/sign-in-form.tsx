'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { signIn } from '@/auth';
import Social from '@/components/auth/social';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter valid email address.' }),
  password: z.string().min(1, { message: 'Please enter password.' }),
  code: z.optional(z.string())
});

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const urlError =
    searchParams.get('error') === 'CredentialsSignin'
      ? 'Invalid email or password.'
      : searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Invalid OAuth Account.'
      : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const response = await axios.post('/api/login', values);

      if (response.data.success) {
        if (response.data.message === 'Login successful.') {
          try {
            setLoading(true);

            await signIn('credentials', {
              ...values,
              callbackUrl: callbackUrl || DEFAULT_SIGNIN_REDIRECT
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          setSuccess(response.data.message);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Oops! Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type='password'
                    placeholder='••••••••'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            type='submit'
            variant='default'
            size='lg'
            className='mt-4'
          >
            {loading && (
              <>
                <Loader2 className='animate-spin mr-2' size={18} />
                Signing in...
              </>
            )}
            {!loading && <>Sign in</>}
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
