'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordSchema } from '@/schemas';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { forgotPassword } from '@/actions/forgot-password';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      forgotPassword(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          form.reset();
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <>
      <div className='grid gap-2 text-start'>
        <h1 className='text-3xl font-bold'>Forgot password?</h1>
        <p className='text-balance text-muted-foreground'>
          Enter your email to get a password reset link.
        </p>
      </div>
      <FormError className='mb-2' message={error} />
      <FormSuccess className='mb-2' message={success} />
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
                Sending email...
              </>
            )}
            {!isPending && <>Send password reset link</>}
          </Button>
          <div>
            <Button variant='link' className='-ml-1 px-0' asChild>
              <Link href='/auth/sign-in' title='Sign up'>
                <ChevronLeft />
                Back to Sign in
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
