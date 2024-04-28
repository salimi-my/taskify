import { SearchParams } from '@/types';
import { getUsers } from '@/data/users';
import { FilterSchema } from '@/schemas';
import { UsersTable } from '@/components/protected/users/table/users-table';

export interface TableProps {
  searchParams: SearchParams;
}

export default function Table({ searchParams }: TableProps) {
  const search = FilterSchema.parse(searchParams);

  const usersPromise = getUsers(search);

  return <UsersTable usersPromise={usersPromise} />;
}
