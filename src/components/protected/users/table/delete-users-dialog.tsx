'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { type Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { deleteUsers } from '@/actions/users/delete-users';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';

type UserWithProvider = User & {
  provider: String;
};

interface DeleteUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: Row<UserWithProvider>[];
  onSuccess?: () => void;
}

export function DeleteUsersDialog({
  users,
  isOpen,
  onClose,
  onSuccess
}: DeleteUsersDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const onDelete = () => {
    startTransition(() => {
      deleteUsers(users.map((row) => row.original.id))
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            onClose();
            onSuccess?.();
            toast.success(data.success);
            router.refresh();
          }
        })
        .catch(() => toast.error('Uh oh! Something went wrong.'));
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
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
  );
}
