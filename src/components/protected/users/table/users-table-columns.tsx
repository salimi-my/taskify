'use client';

import { type Prisma, UserRole } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { UsersTableCellActions } from '@/components/protected/users/table/users-table-cell-actions';

type UserWithProvider = Prisma.UserGetPayload<{
  include: {
    Account: {
      select: {
        provider: true;
      };
    };
  };
}>;

export function getColumns(): ColumnDef<UserWithProvider>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-0.5'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => row.getValue('name')
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => row.getValue('email')
    },
    {
      accessorKey: 'Account.provider',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Provider' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>
          {row.original.Account?.provider
            ? row.original.Account.provider.charAt(0).toUpperCase() +
              row.original.Account.provider.slice(1).toLowerCase()
            : 'Credentials'}
        </Badge>
      )
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Role' />
      ),
      cell: ({ row }) => {
        const role = Object.values(UserRole).find(
          (role) => role === row.getValue('role')
        );

        if (!role) return null;

        return (
          <Badge variant='outline'>
            {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date)
    },
    {
      id: 'actions',
      cell: ({ row }) => <UsersTableCellActions row={row} />
    }
  ];
}
