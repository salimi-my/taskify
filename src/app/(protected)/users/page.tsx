import { Suspense } from 'react';

import { getUsers } from '@/data/users';
import { FilterSchema } from '@/schemas';
import type { SearchParams } from '@/types';
import { DataTableCard } from '@/components/protected/data-table-card';
import { UsersTable } from '@/components/protected/users/table/users-table';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

export interface UsersPageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const search = FilterSchema.parse(searchParams);

  const usersPromise = getUsers(search);

  return (
    <DataTableCard title='Users' description="Here's the list of all users.">
      <Suspense
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
        <UsersTable usersPromise={usersPromise} />
      </Suspense>
    </DataTableCard>
  );
}
