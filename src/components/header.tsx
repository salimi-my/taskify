'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWindowScroll } from '@uidotdev/usehooks';

import { cn } from '@/lib/utils';
import Logo from '@public/taskify-logo.png';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  const [{ y }] = useWindowScroll();

  return (
    <header
      className={cn(
        'z-[50] fixed top-0 w-full bg-transparent border-b',
        y !== null && y > 0
          ? 'backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]'
          : 'border-transparent'
      )}
    >
      <div className='container h-14 flex items-center'>
        <Link
          href='/'
          className='flex justify-start items-center hover:opacity-85 transition-opacity duration-300'
        >
          <Image
            src={Logo}
            placeholder='blur'
            priority
            alt='Taskify Logo'
            className='w-7 h-7 mr-3'
          />
          <h1 className='flex justify-start items-center font-bold text-2xl text-primary'>
            Taskify
          </h1>
          <span className='sr-only'>Taskify</span>
        </Link>
        <nav className='ml-auto flex items-center gap-4 sm:gap-6'>
          <ModeToggle />
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='/auth/sign-in'
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
