'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { EditPasswordSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { editPassword } from '@/actions/account/edit-password';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

export function EditPasswordForm() {
  const router = useRouter();
  const user = useCurrentUser();
  const { update } = useSession();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditPasswordSchema>>({
    resolver: zodResolver(EditPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (values: z.infer<typeof EditPasswordSchema>) => {
    startTransition(() => {
      editPassword(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            update();
            toast.success(data.success);
            router.refresh();
          }
        })
        .catch(() => toast.error('Uh oh! Something went wrong.'));
    });
  };

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        {user?.isOAuth === false && (
          <>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      type='password'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='••••••••'
                      type='password'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='••••••••'
                      type='password'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className='flex justify-end'>
          <Button
            disabled={isPending}
            type='submit'
            variant='default'
            className='mt-2 min-w-24'
          >
            {isPending && (
              <>
                <Loader2 className='animate-spin mr-2' size={18} />
                Saving...
              </>
            )}
            {!isPending && <>Save</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
