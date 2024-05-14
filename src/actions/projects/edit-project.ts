'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { EditProjectSchema } from '@/schemas';
import { getProjectById } from '@/data/projects';

export async function editProject(values: z.infer<typeof EditProjectSchema>) {
  const validatedFields = EditProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { id, name, description } = validatedFields.data;

  const existingProject = await getProjectById(id);

  if (!existingProject) {
    return {
      error: 'Project not found.'
    };
  }

  const updatedProject = await db.project.update({
    where: {
      id
    },
    data: {
      name,
      description
    }
  });

  if (!updatedProject) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  return {
    success: 'Project successfully updated.'
  };
}
