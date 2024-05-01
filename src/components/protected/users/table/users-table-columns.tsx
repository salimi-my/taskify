'use client';

import { User as UserIcon } from 'lucide-react';
import { type User, UserRole } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { UsersTableCellActions } from '@/components/protected/users/table/users-table-cell-actions';

type UserWithProvider = User & {
  provider: String;
};

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
      cell: ({ row }) => (
        <div className='flex space-x-2 items-center'>
          <Avatar className='h-8 w-8 border'>
            <AvatarImage
              src={row.original.image || ''}
              alt={row.original.name || ''}
            />
            <AvatarFallback>
              <UserIcon className='w-5 h-5 text-muted-foreground' />
            </AvatarFallback>
          </Avatar>
          <p className='max-w-[120px] truncate'>{row.getValue('name')}</p>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => row.getValue('email')
    },
    {
      accessorKey: 'provider',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Provider' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>
          {row.original.provider.charAt(0).toUpperCase() +
            row.original.provider.slice(1).toLowerCase()}
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
