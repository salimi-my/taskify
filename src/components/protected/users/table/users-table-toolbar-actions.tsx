import type { User } from '@prisma/client';
import type { Table } from '@tanstack/react-table';

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export default function UsersTableToolbarActions({
  table
}: UsersTableToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>UsersTableToolbarActions</div>
  );
}
