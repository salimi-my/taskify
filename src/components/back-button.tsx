'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  slug?: string;
  label?: string;
}

export function BackButton({ slug, label }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => (slug ? router.push(slug) : router.back())}
      className='bg-white dark:text-primary-foreground dark:hover:text-primary dark:hover:border-slate-500 mb-4'
      variant='outline'
      size='sm'
    >
      <ArrowLeft className='size-4 mr-1' />
      {label || 'Back'}
    </Button>
  );
}
