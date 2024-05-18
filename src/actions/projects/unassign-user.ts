'use server';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { getProjectById } from '@/data/projects';
import { currentUser } from '@/lib/authentication';

export async function unassignUser(
  userId: string,
  projectId: string | undefined
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'You are not authorized to edit this profile.' };
  }

  if (!projectId) {
    return {
      error: 'Project not found.'
    };
  }

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

  const unassignUser = await db.usersOnProjects.delete({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    }
  });

  if (!unassignUser) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  return {
    success: 'User successfully unassigned from project.'
  };
}
