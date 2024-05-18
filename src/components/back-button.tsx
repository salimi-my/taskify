'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface BackButtonProps {
  slug?: string;
  label?: string;
}

export function BackButton({ slug, label }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => (slug ? router.push(slug) : router.back())}
      className='mb-4'
      variant='outline'
    >
      <ArrowLeft className='size-4 mr-1' />
      {label || 'Back'}
    </Button>
  );
}
