'use client';

import { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { AssignUserDialog } from '@/components/protected/projects/assign-user-dialog';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table';
import type { User } from '@prisma/client';

interface ProjectUsersProps {
  users: User[] | null;
}

export function ProjectUsers({ users }: ProjectUsersProps) {
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  return (
    <>
      <div className='w-full flex flex-col gap-3'>
        <div className='flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsAssignOpen(true)}
          >
            <PlusIcon className='mr-2 size-4' aria-hidden='true' />
            Assign User
          </Button>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Salimi</TableCell>
                <TableCell>contact@salimi.my</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <AssignUserDialog
        users={users}
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
      />
    </>
  );
}
