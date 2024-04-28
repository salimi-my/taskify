import { Suspense } from 'react';

import { FilterSchema } from '@/schemas';
import type { SearchParams } from '@/types';
import Table from '@/components/protected/users/table/table';
import { DataTableCard } from '@/components/protected/data-table-card';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

export interface UsersPageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const search = FilterSchema.parse(searchParams);

  return (
    <DataTableCard title='Users' description="Here's the list of all users.">
      <Suspense
        key={JSON.stringify(search)}
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={1}
            cellWidths={['10rem', '35rem', '12rem', '12rem', '8rem']}
            shrinkZero
          />
        }
      >
        <Table searchParams={searchParams} />
      </Suspense>
    </DataTableCard>
  );
}
