import { SearchParams } from '@/types';
import { getProjects } from '@/data/projects';
import { ProjectFilterSchema } from '@/schemas';
import { ProjectsTable } from '@/components/protected/projects/table/projects-table';

export interface TableProps {
  searchParams: SearchParams;
}

export function Table({ searchParams }: TableProps) {
  const search = ProjectFilterSchema.parse(searchParams);

  const projectsPromise = getProjects(search);

  return <ProjectsTable projectsPromise={projectsPromise} />;
}
