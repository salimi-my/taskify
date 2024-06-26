import { useState } from 'react';
import type { User } from '@prisma/client';
import type { Row } from '@tanstack/react-table';
import {
  TrashIcon,
  Pencil2Icon,
  DotsHorizontalIcon
} from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { EditUserDialog } from '@/components/protected/users/table/edit-user-dialog';
import { DeleteUsersDialog } from '@/components/protected/users/table/delete-users-dialog';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type UserWithProvider = User & {
  provider: String;
};

interface UsersTableCellActionsProps {
  row: Row<UserWithProvider>;
}

export function UsersTableCellActions({ row }: UsersTableCellActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteUsersDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        users={[row]}
      />
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={row}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Open menu'
            variant='ghost'
            className='flex size-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='size-4' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Pencil2Icon className='mr-2 size-4' aria-hidden='true' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='group'
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon
              className='mr-2 size-4 group-hover:text-destructive'
              aria-hidden='true'
            />
            <span className='group-hover:text-destructive'>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
