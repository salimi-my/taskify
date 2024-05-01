import { SearchParams } from '@/types';
import { getUsers } from '@/data/users';
import { UserFilterSchema } from '@/schemas';
import { UsersTable } from '@/components/protected/users/table/users-table';

export interface TableProps {
  searchParams: SearchParams;
}

export function Table({ searchParams }: TableProps) {
  const search = UserFilterSchema.parse(searchParams);

  const usersPromise = getUsers(search);

  return <UsersTable usersPromise={usersPromise} />;
}
