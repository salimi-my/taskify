import { BackButton } from '@/components/back-button';
import { ContentLayout } from '@/components/admin-panel/content-layout';

export default async function EditTaskPage({
  params
}: {
  params: { taskId: string };
}) {
  return (
    <ContentLayout title='Edit Task'>
      <BackButton
        slug='/tasks?page=1&sort=createdAt.desc'
        label='Back to Tasks'
      />
      {/* TODO: Edit Task Form */}
    </ContentLayout>
  );
}
