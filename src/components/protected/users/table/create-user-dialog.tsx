'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateUserSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { createUser } from '@/actions/users/create-user';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
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

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserDialog({ isOpen, onClose }: CreateUserDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'USER',
      password: '',
      isForceNewPassword: true,
      isEmailVerified: true
    }
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    startTransition(() => {
      createUser(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            onClose();
            toast.success(data.success);
            router.refresh();
          }
        })
        .catch(() => toast.error('Uh oh! Something went wrong.'));
    });
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user.
          </DialogDescription>
        </DialogHeader>
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
                      placeholder='Enter name'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter email'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isForceNewPassword'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Force New Password</FormLabel>
                    <FormDescription>
                      Force user to change password on next login.
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

            <FormField
              control={form.control}
              name='isEmailVerified'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Email Verification Status</FormLabel>
                    <FormDescription>
                      Change the email verification status of the user.
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

            <div className='flex justify-end gap-2 mt-2'>
              <Button
                type='button'
                variant='outline'
                disabled={isPending}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type='submit'
                variant='default'
                className='min-w-24'
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
      </DialogContent>
    </Dialog>
  );
}
