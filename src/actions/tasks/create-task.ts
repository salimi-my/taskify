'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { CreateTaskSchema } from '@/schemas';
import { currentUser } from '@/lib/authentication';

export async function createTask(values: z.infer<typeof CreateTaskSchema>) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const validatedFields = CreateTaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { title, body, label, priority, projectId, assignees } =
    validatedFields.data;

  const newTask = await db.task.create({
    data: {
      userId: dbUser.id,
      projectId,
      title,
      body,
      label,
      status: 'OPEN',
      priority,
      assignees:
        assignees && assignees?.length > 0
          ? {
              create: assignees?.map((assignee) => {
                return {
                  assignedBy: dbUser.name || '',
                  assignedAt: new Date(),
                  user: {
                    connect: {
                      id: assignee.id
                    }
                  }
                };
              })
            }
          : undefined
    }
  });

  if (!newTask || !newTask.id) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  return {
    success: 'New task successfully created.'
  };
}
