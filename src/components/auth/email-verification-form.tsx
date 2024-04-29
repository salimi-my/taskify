'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { emailVerification } from '@/actions/auth/email-verification';

export function EmailVerificationForm() {
  const submit = useRef(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('Uh oh! Token does not exist.');
      return;
    }

    emailVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError('Uh oh! Something went wrong.');
      });
  }, [token, success, error]);

  useEffect(() => {
    if (!submit.current) {
      submit.current = true;
      onSubmit();
    }
  }, [onSubmit]);

  return (
    <>
      <div className='grid gap-2 text-start'>
        <h1 className='text-3xl font-bold'>Email Verification</h1>
        <p className='text-balance text-muted-foreground'>
          Confirming your email to verify your account.
        </p>
      </div>
      {!success && !error && (
        <div className='flex items-center justify-start'>
          <BeatLoader color='#2563eb' />
        </div>
      )}
      {!!success && <FormSuccess message={success} />}
      {!success && <FormError message={error} />}
      <div>
        <Button variant='link' className='-ml-1 px-0' asChild>
          <Link href='/auth/sign-in' title='Sign up'>
            <ChevronLeft />
            Back to Sign in
          </Link>
        </Button>
      </div>
    </>
  );
}
