import { SearchParams } from '@/types';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export interface TasksPageProps {
  searchParams: SearchParams;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  return <ContentLayout title='All Tasks'>TasksPage</ContentLayout>;
}
