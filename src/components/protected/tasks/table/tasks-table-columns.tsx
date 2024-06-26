import { type Task } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { TasksTableCellActions } from '@/components/protected/tasks/table/tasks-table-cell-actions';

type TaskWithProject = Task & {
  project: string;
};

export function getColumns(): ColumnDef<TaskWithProject>[] {
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => (
        <div className='flex'>
          <span className='max-w-[300px] truncate font-medium'>
            {row.getValue('title')}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'project',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Project' />
      ),
      cell: ({ row }) => row.getValue('project') || 'N/A'
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1).toLowerCase()}
        </Badge>
      )
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Priority' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>
          {row.original.priority.charAt(0).toUpperCase() +
            row.original.priority.slice(1).toLowerCase()}
        </Badge>
      )
    },
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Label' />
      ),
      cell: ({ row }) => (
        <Badge variant='outline'>
          {row.original.label.charAt(0).toUpperCase() +
            row.original.label.slice(1).toLowerCase()}
        </Badge>
      )
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
      cell: ({ row }) => <TasksTableCellActions row={row} />
    }
  ];
}
