import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormErrorProps {
  className?: string;
  message?: string;
}

export function FormError({ className, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <Alert variant='destructive' className={className}>
      <AlertTitle className='flex items-center gap-2'>
        <AlertTriangle className='h-4 w-4' />
        Error
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
