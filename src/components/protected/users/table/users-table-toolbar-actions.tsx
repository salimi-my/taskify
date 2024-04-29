'use client';

import { useState } from 'react';
import type { User } from '@prisma/client';
import type { Table } from '@tanstack/react-table';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { CreateUserDialog } from '@/components/protected/users/table/create-user-dialog';
import { DeleteUsersDialog } from '@/components/protected/users/table/delete-users-dialog';

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export function UsersTableToolbarActions({
  table
}: UsersTableToolbarActionsProps) {
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
          <DeleteUsersDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            users={table.getFilteredSelectedRowModel().rows}
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
          New user
        </Button>
        <CreateUserDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </>
    </div>
  );
}
