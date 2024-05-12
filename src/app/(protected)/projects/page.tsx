import { Suspense } from 'react';

import { SearchParams } from '@/types';
import { ProjectFilterSchema } from '@/schemas';
import { Table } from '@/components/protected/projects/table/table';
import { DataTableCard } from '@/components/protected/data-table-card';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

export interface ProjectsPageProps {
  searchParams: SearchParams;
}

export default async function ProjectsPage({
  searchParams
}: ProjectsPageProps) {
  const search = ProjectFilterSchema.parse(searchParams);

  return (
    <ContentLayout title='All Projects'>
      <DataTableCard
        title='Projects'
        description="Here's the list of all projects."
      >
        <Suspense
          key={JSON.stringify(search)}
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['15rem', '25rem', '10rem', '10rem', '8rem']}
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
