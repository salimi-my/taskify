'use client';

import { use, useMemo } from 'react';
import { type Task } from '@prisma/client';

import { getTasks } from '@/data/tasks';
import { DataTableFilterField } from '@/types';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { getColumns } from '@/components/protected/tasks/table/tasks-table-columns';
import { TasksTableToolbarActions } from '@/components/protected/tasks/table/tasks-table-toolbar-actions';

type TaskWithProject = Task & {
  project: string;
};

interface TasksTableProps {
  tasksPromise: ReturnType<typeof getTasks>;
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  const { data, pageCount } = use(tasksPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), []);

  // Render either a faceted filter or a search filter based on the `options` prop
  const filterFields: DataTableFilterField<TaskWithProject>[] = [
    {
      label: 'Search',
      value: 'title',
      placeholder: 'Search...'
    },
    {
      label: 'Label',
      value: 'label',
      options: ['BUG', 'FEATURE', 'ENHANCEMENT'].map((labelVal) => ({
        label:
          labelVal.charAt(0).toUpperCase() + labelVal.slice(1).toLowerCase(),
        value: labelVal,
        withCount: true
      }))
    },
    {
      label: 'Priority',
      value: 'priority',
      options: ['LOW', 'MEDIUM', 'HIGH'].map((priority) => ({
        label:
          priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
        value: priority,
        withCount: true
      }))
    },
    {
      label: 'Status',
      value: 'status',
      options: ['OPEN', 'TODO', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'].map(
        (status) => ({
          label:
            status.replace(/_/g, ' ').charAt(0).toUpperCase() +
            status.replace(/_/g, ' ').slice(1).toLowerCase(),
          value: status,
          withCount: true
        })
      )
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
        <TasksTableToolbarActions table={table} />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
