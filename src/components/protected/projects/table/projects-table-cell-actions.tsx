import Link from 'next/link';
import { useState } from 'react';
import type { Project } from '@prisma/client';
import type { Row } from '@tanstack/react-table';
import {
  TrashIcon,
  Pencil2Icon,
  DotsHorizontalIcon
} from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { DeleteProjectsDialog } from '@/components/protected/projects/table/delete-projects-dialog';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

interface ProjectsTableCellActionsProps {
  row: Row<ProjectWithCount>;
}

export function ProjectsTableCellActions({
  row
}: ProjectsTableCellActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteProjectsDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        projects={[row]}
      />
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
            <Link href={`/projects/${row.original.id}/edit`}>
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
