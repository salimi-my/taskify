import { Suspense } from 'react';

import { SearchParams } from '@/types';
import { TaskFilterSchema } from '@/schemas';
import { Table } from '@/components/protected/tasks/table/table';
import { DataTableCard } from '@/components/protected/data-table-card';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

export interface TasksPageProps {
  searchParams: SearchParams;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const search = TaskFilterSchema.parse(searchParams);

  return (
    <ContentLayout title='All Tasks'>
      <DataTableCard title='Tasks' description="Here's the list of all tasks.">
        <Suspense
          key={JSON.stringify(search)}
          fallback={
            <DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['15rem', '25rem', '10rem', '10rem', '8rem', '8rem']}
              shrinkZero
            />
          }
        >
          <Table searchParams={searchParams} />
        </Suspense>
      </DataTableCard>
    </ContentLayout>
  );
}
