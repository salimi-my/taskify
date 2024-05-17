'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AssignProjectUserSchema } from '@/schemas';
import { assignUser } from '@/actions/projects/assign-user';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput
} from '@/components/ui/command';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

interface AssignUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[] | undefined;
  projectId: string | undefined;
}

export function AssignUserDialog({
  users,
  isOpen,
  onClose,
  projectId
}: AssignUserDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AssignProjectUserSchema>>({
    resolver: zodResolver(AssignProjectUserSchema),
    defaultValues: {
      projectId: projectId || '',
      userId: ''
    }
  });

  const onSubmit = (values: z.infer<typeof AssignProjectUserSchema>) => {
    startTransition(() => {
      assignUser(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            onClose();
            form.reset();
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
          <DialogTitle>Assign User</DialogTitle>
          <DialogDescription>
            Select user to be assigned to the project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='mb-1'>User</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value && users
                            ? users.find((user) => user.id === field.value)
                                ?.name
                            : 'Select user'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]'>
                      <Command>
                        <CommandInput
                          placeholder='Search user...'
                          className='h-9'
                        />
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {users &&
                              users.map((user) => (
                                <CommandItem
                                  value={user.id}
                                  key={user.id}
                                  onSelect={() => {
                                    form.setValue('userId', user.id);
                                  }}
                                >
                                  {user.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      user.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
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
