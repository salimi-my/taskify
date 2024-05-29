import { getAllUsers } from '@/data/users';
import { getAllProjects } from '@/data/projects';
import { BackButton } from '@/components/back-button';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { CreateTaskForm } from '@/components/protected/tasks/create-task-form';

export default async function CreateTaskPage() {
  const users = await getAllUsers();
  const projects = await getAllProjects();

  return (
    <ContentLayout title='New Task'>
      <BackButton
        slug='/tasks?page=1&sort=createdAt.desc'
        label='Back to Tasks'
      />
      <CreateTaskForm users={users} projects={projects} />
    </ContentLayout>
  );
}
