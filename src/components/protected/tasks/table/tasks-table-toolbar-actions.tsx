'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Task } from '@prisma/client';
import type { Table } from '@tanstack/react-table';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

type TaskWithProject = Task & {
  project: string;
};

interface TasksTableToolbarActionsProps {
  table: Table<TaskWithProject>;
}

export function TasksTableToolbarActions({
  table
}: TasksTableToolbarActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
        </>
      ) : null}
      <>
        <Button variant='outline' size='sm' asChild>
          <Link href='/tasks/create'>
            <PlusIcon className='mr-2 size-4' aria-hidden='true' />
            New task
          </Link>
        </Button>
      </>
    </div>
  );
}
