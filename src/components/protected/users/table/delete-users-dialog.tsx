'use client';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { type Row } from '@tanstack/react-table';
import { TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { deleteUser } from '@/actions/delete-user';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';

interface DeleteUsersDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  users: Row<User>[];
  onSuccess?: () => void;
  showTrigger?: boolean;
}

export default function DeleteUsersDialog({
  users,
  onSuccess,
  showTrigger = true,
  ...props
}: DeleteUsersDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(() => {
      deleteUser(users.map((row) => row.original.id))
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            setIsOpen(false);
            toast.success(data.success);
            router.refresh();
          }
        })
        .catch(() => toast.error('Uh oh! Something went wrong.'));
    });
  };

  return (
    <>
      {showTrigger ? (
        <Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
          <TrashIcon className='mr-2 size-4' aria-hidden='true' />
          Delete ({users.length})
        </Button>
      ) : null}
      <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className='font-medium'>{users.length}</span>
              {users.length === 1 ? ' user' : ' users'} from database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0'>
            <DialogClose asChild>
              <Button variant='outline' disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              aria-label='Delete selected rows'
              variant='destructive'
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && (
                <>
                  <Loader2 className='animate-spin mr-2' size={18} />
                  Deleting...
                </>
              )}
              {!isPending && <>Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
