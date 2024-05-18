import { getAllUsers } from '@/data/users';
import { getProjectById } from '@/data/projects';
import { BackButton } from '@/components/back-button';
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
  const allUsers = await getAllUsers();
  const project = await getProjectById(params.projectId);

  return (
    <ContentLayout title='Edit Project'>
      <BackButton
        slug='/projects?page=1&sort=createdAt.desc'
        label='Back to Projects'
      />
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
            <ProjectUsers allUsers={allUsers} project={project} />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
