'use client';

import { usePathname } from 'next/navigation';

export function PageTitle() {
  const pathname = usePathname();

  let pageTitle = '';

  if (pathname === '/dashboard') {
    pageTitle = 'Dashboard';
  } else if (pathname === '/account') {
    pageTitle = 'Account';
  }

  return <h1 className='font-bold'>{pageTitle}</h1>;
}
