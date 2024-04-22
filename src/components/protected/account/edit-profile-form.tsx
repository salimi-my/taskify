'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { EditProfileSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { editProfile } from '@/actions/edit-profile';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@/components/ui/select';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';

export function EditProfileForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.tempEmail ? user.tempEmail : user?.email ? user.email : '',
      role: user?.role || 'USER',
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false
    }
  });

  const onSubmit = (values: z.infer<typeof EditProfileSchema>) => {
    startTransition(() => {
      editProfile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            update({
              user: {
                name: values.name,
                role: values.role,
                isTwoFactorEnabled: values.isTwoFactorEnabled
              }
            });
            toast.success(data.success);
            router.refresh();
          }
        })
        .catch(() => {
          toast.error('Uh oh! Something went wrong.');
        });
    });
  };

  const onCancelEmailUpdate = () => {};

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter your name'
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {user?.isOAuth === false && (
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className='flex gap-2'>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter your email'
                      disabled={isPending || !!user.tempEmail}
                    />
                  </FormControl>
                  {!!user.tempEmail && (
                    <Button
                      type='button'
                      onClick={onCancelEmailUpdate}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                {!!user.tempEmail && (
                  <FormDescription>
                    Please verify your new email address or cancel to use old
                    email address
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {user?.isOAuth === false && (
          <FormField
            control={form.control}
            name='isTwoFactorEnabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                <div className='space-y-0.5'>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
