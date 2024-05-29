import * as z from 'zod';
import type { Project } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/lib/db';
import { ProjectFilterSchema } from '@/schemas';

type ProjectWithCount = Project & {
  tasksCount: number;
  usersCount: number;
};

interface ReturnData {
  data: ProjectWithCount[];
  pageCount: number;
}

export async function getProjects(
  filters: z.infer<typeof ProjectFilterSchema>
): Promise<ReturnData> {
  noStore();
  const { page, per_page, sort, name, from, to } = filters;

  try {
    // Number of items per page
    const limit = per_page;

    // Number of items to skip
    const offset = (page - 1) * per_page;

    // Column and order to sort
    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc'
    ]) as [keyof Project | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Define orderBy
    const orderBy: { [key: string]: 'asc' | 'desc' } =
      column && ['name', 'description', 'createdAt'].includes(column)
        ? order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { createdAt: 'desc' };

    const [rawData, total] = await Promise.all([
      db.project.findMany({
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              tasks: true,
              users: true
            }
          }
        },
        where: {
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          OR:
            typeof name === 'string'
              ? [
                  {
                    name: {
                      contains: name
                    }
                  },
                  {
                    description: {
                      contains: name
                    }
                  }
                ]
              : undefined
        },
        orderBy
      }),
      db.project.count({
        where: {
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          OR:
            typeof name === 'string'
              ? [
                  {
                    name: {
                      contains: name
                    }
                  },
                  {
                    description: {
                      contains: name
                    }
                  }
                ]
              : undefined
        }
      })
    ]);

    const pageCount = Math.ceil(total / per_page);

    const data = rawData.map((project) => {
      const { _count, ...projectWithoutCount } = project;
      return {
        ...projectWithoutCount,
        tasksCount: _count.tasks,
        usersCount: _count.users
      };
    });

    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await db.project.findUnique({
      include: {
        users: true
      },
      where: {
        id
      }
    });

    return project;
  } catch {
    return null;
  }
}

export async function getAllProjects() {
  try {
    const projects = await db.project.findMany();

    return projects;
  } catch {
    return null;
  }
}
