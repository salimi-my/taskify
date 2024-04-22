import Link from 'next/link';
import Image from 'next/image';

import AuthImage from '@public/auth-image.png';
import { ModeToggle } from '@/components/mode-toggle';
import LogoLight from '@public/taskify-logo-light.png';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full lg:grid min-h-screen lg:grid-cols-3'>
      <div className='relative hidden flex-col justify-between p-10 pb-0 text-white lg:flex bg-primary dark:bg-primary/80 h-full'>
        <Link
          href='/'
          className='flex justify-start items-center hover:opacity-85 transition-opacity duration-300'
        >
          <Image
            src={LogoLight}
            placeholder='blur'
            priority
            alt='Taskify Logo'
            className='w-7 h-7 mr-3'
          />
          <h1 className='flex justify-start items-center font-bold text-2xl'>
            Taskify
          </h1>
        </Link>
        <div className='w-full max-w-[512px]'>
          <h2 className='text-5xl font-extrabold [text-shadow:_7px_0_hsl(var(--foreground))] dark:[text-shadow:_7px_0_hsl(222.2,84%,4.9%)]'>
            Organize, Prioritize, Conquer Your Tasks!
          </h2>
          <p className='text-muted pt-5 font-light dark:text-white'>
            Taskify is a comprehensive project management and powerful task
            management app designed to streamline your workflow, enhance
            collaboration, and boost productivity.
          </p>
        </div>
        <div className='w-full max-w-[512px]'>
          <Image
            src={AuthImage}
            placeholder='blur'
            priority
            alt='Taskify Logo'
            width={400}
            height={467}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
      <div className='relative flex items-center justify-center py-12 col-span-2 min-h-screen'>
        <div className='absolute top-4 right-4'>
          <ModeToggle />
        </div>
        <div className='mx-auto grid w-[416px] gap-6 px-4'>{children}</div>
      </div>
    </div>
  );
}
