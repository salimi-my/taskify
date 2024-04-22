import { currentUser } from '@/lib/authentication';
import { EditProfileForm } from '@/components/protected/account/edit-profile-form';
import { EditPasswordForm } from '@/components/protected/account/edit-password-form';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <div className='grid lg:grid-cols-2 gap-4'>
      <Card className='rounded-lg border-none'>
        <CardHeader className='mx-[1px] pb-9'>
          <CardTitle className='text-xl font-semibold'>Profile</CardTitle>
          <CardDescription>
            Manage your account profile informations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm />
        </CardContent>
      </Card>
      {user?.isOAuth === false && (
        <div>
          <Card className='rounded-lg border-none'>
            <CardHeader className='mx-[1px] pb-9'>
              <CardTitle className='text-xl font-semibold'>Password</CardTitle>
              <CardDescription>Manage your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditPasswordForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
