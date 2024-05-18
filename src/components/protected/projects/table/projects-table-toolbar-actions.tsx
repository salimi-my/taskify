'use client';

import { useState } from 'react';
import type { Project } from '@prisma/client';
import type { Table } from '@tanstack/react-table';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from '@/components/protected/projects/table/create-project-dialog';
import { DeleteProjectsDialog } from '@/components/protected/projects/table/delete-projects-dialog';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

interface ProjectsTableToolbarActionsProps {
  table: Table<ProjectWithCount>;
}

export function ProjectsTableToolbarActions({
  table
}: ProjectsTableToolbarActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDeleteOpen(true)}
            className='group'
          >
            <TrashIcon
              className='mr-2 size-4 group-hover:text-destructive'
              aria-hidden='true'
            />
            <span className='group-hover:text-destructive'>
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </span>
          </Button>
          <DeleteProjectsDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            projects={table.getFilteredSelectedRowModel().rows}
            onSuccess={() => table.toggleAllPageRowsSelected(false)}
          />
        </>
      ) : null}
      <>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusIcon className='mr-2 size-4' aria-hidden='true' />
          New project
        </Button>
        <CreateProjectDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </>
    </div>
  );
}
