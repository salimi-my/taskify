'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { getProjectById } from '@/data/projects';
import { currentUser } from '@/lib/authentication';
import { AssignProjectUserSchema } from '@/schemas';

export async function assignUser(
  values: z.infer<typeof AssignProjectUserSchema>
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const validatedFields = AssignProjectUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { projectId, userId } = validatedFields.data;

  const existingProject = await getProjectById(projectId);

  if (!existingProject) {
    return {
      error: 'Project not found.'
    };
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return {
      error: 'User not found.'
    };
  }

  const assignUser = await db.project.update({
    where: {
      id: projectId
    },
    data: {
      users: {
        create: [
          {
            assignedAt: new Date(),
            assignedBy: dbUser.id,
            user: {
              connect: {
                id: userId
              }
            }
          }
        ]
      }
    }
  });

  if (!assignUser) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  return {
    success: 'User successfully assigned to project.'
  };
}
