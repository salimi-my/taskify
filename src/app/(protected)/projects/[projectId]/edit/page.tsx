import { getProjectById } from '@/data/projects';
import { getUnassignedUsers } from '@/data/users';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { ProjectUsers } from '@/components/protected/projects/project-users';
import { EditProjectForm } from '@/components/protected/projects/edit-project-form';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';

export default async function EditProjectPage({
  params
}: {
  params: { projectId: string };
}) {
  const project = await getProjectById(params.projectId);
  const unassignedUser = await getUnassignedUsers(project?.id);

  return (
    <ContentLayout title='Edit Project'>
      <div className='grid lg:grid-cols-5 gap-4'>
        <Card className='rounded-lg border-none col-span-2'>
          <CardHeader className='mx-[1px] pb-9'>
            <CardTitle className='text-xl font-semibold'>
              Edit Project
            </CardTitle>
            <CardDescription>
              Update project details & informations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditProjectForm project={project} />
          </CardContent>
        </Card>
        <Card className='rounded-lg border-none col-span-3'>
          <CardHeader className='mx-[1px] pb-9'>
            <CardTitle className='text-xl font-semibold'>
              Users Assigned to Project
            </CardTitle>
            <CardDescription>
              Display list of users assigned to this project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectUsers users={unassignedUser} />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
