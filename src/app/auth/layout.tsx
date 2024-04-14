import Image from 'next/image';
import Link from 'next/link';

import AuthImage from '@public/auth-image.png';
import LogoWhite from '@public/taskify-logo-white.png';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full lg:grid min-h-screen lg:grid-cols-3'>
      <div className='relative hidden flex-col justify-between p-10 pb-0 text-white lg:flex bg-primary dark:bg-gray-200 h-full'>
        <Link
          href='/'
          className='flex justify-start items-center hover:opacity-85 transition-opacity duration-300'
        >
          <Image
            src={LogoWhite}
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
          <h2 className='text-5xl font-extrabold [text-shadow:_7px_0_hsl(var(--foreground))]'>
            Organize, Prioritize, Conquer Your Tasks!
          </h2>
          <p className='text-muted pt-5 font-light'>
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
            className='w-full h-full object-cover'
          />
        </div>
      </div>
      <div className='flex items-center justify-center py-12 col-span-2 min-h-screen'>
        <div className='mx-auto grid w-[416px] gap-6 px-4'>{children}</div>
      </div>
    </div>
  );
}
