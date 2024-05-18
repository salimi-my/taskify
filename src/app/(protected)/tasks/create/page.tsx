import { BackButton } from '@/components/back-button';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';

export default function CreateTaskPage() {
  return (
    <ContentLayout title='New Task'>
      <BackButton
        slug='/tasks?page=1&sort=createdAt.desc'
        label='Back to Tasks'
      />
      <div className='grid xl:grid-cols-8 gap-4'>
        <div className='xl:col-span-5'>
          <Card className='rounded-lg border-none'>
            <CardHeader className='mx-[1px] pb-9'>
              <CardTitle className='text-xl font-semibold'>
                Create Task
              </CardTitle>
              <CardDescription>
                Fill in the form to create a new task.
              </CardDescription>
            </CardHeader>
            <CardContent>{/* TODO: Add create task form */}</CardContent>
          </Card>
        </div>
        <div className='xl:col-span-3'>
          <Card className='rounded-lg border-none'>
            <CardHeader className='mx-[1px] pb-9'>
              <CardTitle className='text-xl font-semibold'>
                Task Details
              </CardTitle>
              <CardDescription>Manage additional task details.</CardDescription>
            </CardHeader>
            <CardContent>{/* TODO: Add task details form */}</CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
