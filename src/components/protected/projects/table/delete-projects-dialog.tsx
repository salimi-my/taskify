'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Project } from '@prisma/client';
import { type Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
// import { deleteProject } from '@/actions/projects/delete-project';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

interface DeleteProjectsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Row<ProjectWithCount>[];
  onSuccess?: () => void;
}

export function DeleteProjectsDialog({
  isOpen,
  onClose,
  projects,
  onSuccess
}: DeleteProjectsDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const onDelete = () => {
    startTransition(() => {
      // TODO: Create delete projects server action
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-medium'>{projects.length}</span>
            {projects.length === 1 ? ' user' : ' users'} from database.
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
