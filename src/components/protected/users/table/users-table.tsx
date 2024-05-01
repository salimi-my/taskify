'use client';

import { use, useMemo } from 'react';
import { type User, UserRole } from '@prisma/client';

import { getUsers } from '@/data/users';
import { DataTableFilterField } from '@/types';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { getColumns } from '@/components/protected/users/table/users-table-columns';
import { UsersTableToolbarActions } from '@/components/protected/users/table/users-table-toolbar-actions';

type UserWithProvider = User & {
  provider: String;
};

interface UsersTableProps {
  usersPromise: ReturnType<typeof getUsers>;
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  const { data, pageCount } = use(usersPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);

  // Render either a faceted filter or a search filter based on the `options` prop
  const filterFields: DataTableFilterField<UserWithProvider>[] = [
    {
      label: 'Search',
      value: 'name',
      placeholder: 'Search...'
    },
    {
      label: 'Role',
      value: 'role',
      options: Object.values(UserRole).map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
        value: role,
        withCount: true
      }))
    },
    {
      label: 'Provider',
      value: 'provider',
      options: ['google', 'github', 'credentials'].map((provider) => ({
        label:
          provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase(),
        value: provider,
        withCount: true
      }))
    }
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'createdAt.desc'
  });

  return (
    <div className='w-full space-y-2.5 overflow-auto'>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UsersTableToolbarActions table={table} />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
