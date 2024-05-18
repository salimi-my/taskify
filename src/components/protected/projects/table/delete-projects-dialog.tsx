'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Project } from '@prisma/client';
import { type Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { deleteProjects } from '@/actions/projects/delete-projects';
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
      deleteProjects(projects.map((row) => row.original.id))
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
            <span className='font-medium'>{projects.length}</span>
            {projects.length === 1 ? ' project' : ' projects'} from database.
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
