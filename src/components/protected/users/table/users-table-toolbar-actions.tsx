'use client';

import { useState } from 'react';

import type { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import DeleteUsersDialog from '@/components/protected/users/table/delete-users-dialog';

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export default function UsersTableToolbarActions({
  table
}: UsersTableToolbarActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDialogOpen(true)}
          >
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
          <DeleteUsersDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            users={table.getFilteredSelectedRowModel().rows}
            onSuccess={() => table.toggleAllPageRowsSelected(false)}
          />
        </>
      ) : null}
    </div>
  );
}
