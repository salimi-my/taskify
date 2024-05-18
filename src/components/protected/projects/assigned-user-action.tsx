'use client';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { unassignUser } from '@/actions/projects/unassign-user';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface AssignedUserActionProps {
  userId: string;
  projectId: string | undefined;
}

export function AssignedUserAction({
  userId,
  projectId
}: AssignedUserActionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  };

  const onRemove = () => {
    startTransition(() => {
      unassignUser(userId, projectId)
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Open menu'
            variant='ghost'
            className='flex size-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='size-4' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem className='group' onSelect={() => setIsOpen(true)}>
            <TrashIcon
              className='mr-2 size-4 group-hover:text-destructive'
              aria-hidden='true'
            />
            <span className='group-hover:text-destructive'>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will remove this user from the project.
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
              onClick={onRemove}
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
