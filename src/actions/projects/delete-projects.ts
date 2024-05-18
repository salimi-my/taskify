'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/authentication';
import { getErrorMessage } from '@/lib/handle-error';

export async function deleteProjects(project_ids: string[]) {
  const user = await currentUser();

  if (!user || !user.id || user.role !== 'ADMIN') {
    return { error: 'You are not authorized to delete projects.' };
  }

  try {
    // Delete related UsersOnProjects records
    const deleteUsersOnProjects = await db.usersOnProjects.deleteMany({
      where: {
        projectId: {
          in: project_ids
        }
      }
    });

    const deleteProject = await db.project.deleteMany({
      where: {
        id: {
          in: project_ids
        }
      }
    });

    if (!deleteUsersOnProjects || !deleteProject) {
      return {
        error: 'Uh oh! Something went wrong.'
      };
    }

    return {
      success:
        (project_ids.length > 1 ? 'Projects' : 'Project') +
        ' successfully deleted.'
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
