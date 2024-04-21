'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className='w-full border-t'>
      <div className='container flex flex-col gap-2 sm:flex-row py-6 shrink-0 items-center'>
        <p className='text-xs text-neutral-500 dark:text-neutral-400'>
          © {new Date().getFullYear()} Taskify. Created by{' '}
          <Button
            variant='link'
            className='text-xs px-0 text-neutral-500 dark:text-neutral-400'
            asChild
          >
            <Link
              href='https://www.salimi.my'
              target='_blank'
              rel='noopener noreferrer'
            >
              Salimi
            </Link>
          </Button>
          .
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Terms of Service
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
