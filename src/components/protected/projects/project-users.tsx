'use client';

import { useState } from 'react';
import { UserIcon } from 'lucide-react';
import type { Prisma, User } from '@prisma/client';
import { TrashIcon, PlusIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssignUserDialog } from '@/components/protected/projects/assign-user-dialog';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type ProjectWithUsers = Prisma.ProjectGetPayload<{
  include: {
    users: true;
  };
}>;

interface ProjectUsersProps {
  allUsers: User[] | null;
  project: ProjectWithUsers | null;
}

export function ProjectUsers({ allUsers, project }: ProjectUsersProps) {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const assignedUsers = allUsers?.filter((user) =>
    project?.users.some((u) => u.userId === user.id)
  );
  const unassignedUsers = allUsers?.filter(
    (user) => !project?.users.some((u) => u.userId === user.id)
  );

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
              {assignedUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex space-x-2 items-center'>
                      <Avatar className='h-8 w-8 border'>
                        <AvatarImage
                          src={user.image || ''}
                          alt={user.name || ''}
                        />
                        <AvatarFallback>
                          <UserIcon className='w-5 h-5 text-muted-foreground' />
                        </AvatarFallback>
                      </Avatar>
                      <p className='max-w-[120px] truncate'>{user.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label='Open menu'
                          variant='ghost'
                          className='flex size-8 p-0 data-[state=open]:bg-muted'
                        >
                          <DotsHorizontalIcon
                            className='size-4'
                            aria-hidden='true'
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuItem
                          className='group'
                          onSelect={() => setIsDeleteDialogOpen(true)}
                        >
                          <TrashIcon
                            className='mr-2 size-4 group-hover:text-destructive'
                            aria-hidden='true'
                          />
                          <span className='group-hover:text-destructive'>
                            Delete
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AssignUserDialog
        users={unassignedUsers}
        projectId={project?.id}
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
      />
    </>
  );
}
