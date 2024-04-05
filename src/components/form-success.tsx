import { CircleCheck } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormSuccessProps {
  className?: string;
  message?: string;
}

export function FormSuccess({ className, message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <Alert variant='success' className={className}>
      <AlertTitle className='flex items-center gap-2'>
        <CircleCheck className='h-4 w-4' />
        Success
      </AlertTitle>
      <AlertDescription>Invalid email or password.</AlertDescription>
    </Alert>
  );
}
