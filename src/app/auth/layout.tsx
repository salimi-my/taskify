import Image from 'next/image';
import BgImage from '@public/auth-layout-bg.jpg';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full lg:grid min-h-screen lg:grid-cols-3'>
      <div className='hidden bg-muted lg:block'>
        <Image
          src={BgImage}
          placeholder='blur'
          priority
          alt='Auth Image'
          className='h-full w-full object-cover brightness-90 dark:brightness-[0.2] dark:grayscale'
        />
      </div>
      <div className='flex items-center justify-center py-12 col-span-2'>
        <div className='mx-auto grid w-[350px] gap-6'>{children}</div>
      </div>
    </div>
  );
}
