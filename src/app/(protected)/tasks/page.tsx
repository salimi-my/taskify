import { SearchParams } from '@/types';
import { TaskFilterSchema } from '@/schemas';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export interface TasksPageProps {
  searchParams: SearchParams;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const search = TaskFilterSchema.parse(searchParams);

  return <ContentLayout title='All Tasks'>TasksPage</ContentLayout>;
}
