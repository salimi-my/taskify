import type { User } from '@prisma/client';
import type { Table } from '@tanstack/react-table';
import DeleteUsersDialog from './delete-users-dialog';

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export default function UsersTableToolbarActions({
  table
}: UsersTableToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteUsersDialog
          users={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
    </div>
  );
}
