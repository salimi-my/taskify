'use client';

import { use, useMemo } from 'react';
import { type Project, UserRole } from '@prisma/client';

import { getProjects } from '@/data/projects';
import { DataTableFilterField } from '@/types';
import { useDataTable } from '@/hooks/use-data-table';
import { useCurrentRole } from '@/hooks/use-current-role';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { getColumns } from '@/components/protected/projects/table/projects-table-columns';
import { ProjectsTableToolbarActions } from '@/components/protected/projects/table/projects-table-toolbar-actions';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

interface ProjectsTableProps {
  projectsPromise: ReturnType<typeof getProjects>;
}

export function ProjectsTable({ projectsPromise }: ProjectsTableProps) {
  const role = useCurrentRole();
  const { data, pageCount } = use(projectsPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(role), [role]);

  // Render either a faceted filter or a search filter based on the `options` prop
  const filterFields: DataTableFilterField<ProjectWithCount>[] = [
    {
      label: 'Search',
      value: 'name',
      placeholder: 'Search...'
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
        {role === UserRole.ADMIN && (
          <ProjectsTableToolbarActions table={table} />
        )}
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
