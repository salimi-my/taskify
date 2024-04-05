'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import Social from '@/components/auth/social';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Please enter name.' }),
    email: z.string().email({ message: 'Please enter valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Please enter at least 8 characters.' }),
    confirm: z
      .string()
      .min(8, { message: 'Please enter at least 8 characters.' })
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords does not match.',
    path: ['confirm']
  });

export function SignUpForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <>
      <div className='grid gap-2 text-start'>
        <h1 className='text-3xl font-bold'>Create an account</h1>
        <p className='text-balance text-muted-foreground'>
          to continue to using Taskify
        </p>
      </div>
      <Social />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 -mt-1'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type='text'
                    placeholder='John Doe'
                    autoComplete='name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type='email'
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
          <FormField
            control={form.control}
            name='confirm'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Confirm Password</FormLabel>
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
                Creating an account...
              </>
            )}
            {!loading && <>Create an account</>}
          </Button>
          <p className='text-sm font-light text-gray-500 dark:text-gray-400 mt-1'>
            Already have an account?
            <Button variant='link' className='ml-1 px-0' asChild>
              <Link href='/auth/sign-in' title='Sign in'>
                Sign in
              </Link>
            </Button>
          </p>
        </form>
      </Form>
    </>
  );
}
