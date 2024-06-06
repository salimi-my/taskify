import Link from 'next/link';
import { useState } from 'react';
import type { Task } from '@prisma/client';
import type { Row } from '@tanstack/react-table';
import {
  TrashIcon,
  Pencil2Icon,
  DotsHorizontalIcon
} from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
// import { DeleteTasksDialog } from '@/components/protected/tasks/table/delete-tasks-dialog';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type TaskWithProject = Task & {
  project: string;
};

interface TasksTableCellActionsProps {
  row: Row<TaskWithProject>;
}

export function TasksTableCellActions({ row }: TasksTableCellActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      {/* <DeleteTasksDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        users={[row]}
      /> */}
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
          <DropdownMenuItem asChild>
            <Link href={`/tasks/${row.original.id}/edit`}>
              <Pencil2Icon className='mr-2 size-4' aria-hidden='true' />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='group'
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon
              className='mr-2 size-4 group-hover:text-destructive'
              aria-hidden='true'
            />
            <span className='group-hover:text-destructive'>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
