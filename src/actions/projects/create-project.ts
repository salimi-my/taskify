'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { CreateProjectSchema } from '@/schemas';

export async function createProject(
  values: z.infer<typeof CreateProjectSchema>
) {
  const validatedFields = CreateProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.'
    };
  }

  const { name, description } = validatedFields.data;

  const newProject = await db.project.create({
    data: {
      name,
      description
    }
  });

  if (!newProject || !newProject.id) {
    return {
      error: 'Uh oh! Something went wrong.'
    };
  }

  return {
    success: 'New project successfully created.'
  };
}
