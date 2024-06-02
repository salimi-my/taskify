import { SearchParams } from '@/types';
import { getTasks } from '@/data/tasks';
import { TaskFilterSchema } from '@/schemas';

export interface TableProps {
  searchParams: SearchParams;
}

export function Table({ searchParams }: TableProps) {
  const search = TaskFilterSchema.parse(searchParams);

  const tasksPromise = getTasks(search);

  return <div>TaskTable</div>;
}
