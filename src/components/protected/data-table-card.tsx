import { cn } from '@/lib/utils';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';

interface DataTableCardProps {
  title: string;
  className?: string;
  description: string;
  children: React.ReactNode;
}

export function DataTableCard({
  title,
  children,
  className,
  description
}: DataTableCardProps) {
  return (
    <Card className={cn('rounded-lg border-none', className)}>
      <CardHeader className='mx-[1px] pb-9'>
        <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
