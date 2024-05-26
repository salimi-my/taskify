import { EdgeStoreProvider } from '@/lib/edgestore';
import { AdminPanelLayout } from '@/components/admin-panel/admin-panel-layout';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <EdgeStoreProvider>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </EdgeStoreProvider>
  );
}
