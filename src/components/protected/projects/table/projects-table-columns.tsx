'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { type Project, UserRole } from '@prisma/client';

import { formatDate } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ProjectsTableCellActions } from '@/components/protected/projects/table/projects-table-cell-actions';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

export function getColumns(role?: UserRole): ColumnDef<ProjectWithCount>[] {
  const commonColumns: ColumnDef<ProjectWithCount>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => row.getValue('name')
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => row.getValue('description')
    },
    {
      accessorKey: 'tasksCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tasks' />
      ),
      cell: ({ row }) => row.getValue('tasksCount')
    },
    {
      accessorKey: 'usersCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Users' />
      ),
      cell: ({ row }) => row.getValue('usersCount')
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date)
    }
  ];

  if (role === UserRole.ADMIN) {
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      ...commonColumns,
      {
        id: 'actions',
        cell: ({ row }) => <ProjectsTableCellActions row={row} />
      }
    ];
  } else {
    return commonColumns;
  }
}
