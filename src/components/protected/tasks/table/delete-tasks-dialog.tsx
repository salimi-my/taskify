'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Task } from '@prisma/client';
import { type Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
// import { deleteTasks } from '@/actions/tasks/delete-tasks';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';

type TaskWithProject = Task & {
  project: string;
};

interface DeleteTasksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Row<TaskWithProject>[];
  onSuccess?: () => void;
}

export function DeleteTasksDialog({
  isOpen,
  onClose,
  tasks,
  onSuccess
}: DeleteTasksDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const onDelete = () => {
    startTransition(() => {
      // TODO add delete tasks server action
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-medium'>{tasks.length}</span>
            {tasks.length === 1 ? ' task' : ' tasks'} from database.
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
