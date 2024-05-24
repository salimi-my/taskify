import { BackButton } from '@/components/back-button';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { CreateTaskForm } from '@/components/protected/tasks/create-task-form';

export default function CreateTaskPage() {
  return (
    <ContentLayout title='New Task'>
      <BackButton
        slug='/tasks?page=1&sort=createdAt.desc'
        label='Back to Tasks'
      />
      <CreateTaskForm />
    </ContentLayout>
  );
}
