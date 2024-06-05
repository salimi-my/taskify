import * as z from 'zod';
import { unstable_noStore as noStore } from 'next/cache';
import type { Task, TaskLabel, TaskPriority, TaskStatus } from '@prisma/client';

import { db } from '@/lib/db';
import { TaskFilterSchema } from '@/schemas';

type TaskWithProject = Task & {
  project: string;
};

interface ReturnData {
  data: TaskWithProject[];
  pageCount: number;
}

export async function getTasks(
  filters: z.infer<typeof TaskFilterSchema>
): Promise<ReturnData> {
  noStore();
  const { page, per_page, sort, title, label, priority, status, from, to } =
    filters;

  try {
    // Number of items per page
    const limit = per_page;

    // Number of items to skip
    const offset = (page - 1) * per_page;

    // Column and order to sort
    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc'
    ]) as [keyof TaskWithProject | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Define orderBy
    const orderBy: { [key: string]: 'asc' | 'desc' } =
      column &&
      [
        'title',
        'description',
        'label',
        'priority',
        'status',
        'createdAt'
      ].includes(column)
        ? order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { createdAt: 'desc' };

    const [rawData, total] = await Promise.all([
      db.task.findMany({
        skip: offset,
        take: limit,
        include: {
          project: true
        },
        where: {
          label: {
            in: label ? (label.split('.') as TaskLabel[]) : undefined
          },
          priority: {
            in: priority ? (priority.split('.') as TaskPriority[]) : undefined
          },
          status: {
            in: status ? (status.split('.') as TaskStatus[]) : undefined
          },
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          OR:
            typeof title === 'string'
              ? [
                  {
                    title: {
                      contains: title
                    }
                  },
                  {
                    body: {
                      contains: title
                    }
                  }
                ]
              : undefined
        },
        orderBy
      }),
      db.task.count({
        where: {
          label: {
            in: label ? (label.split('.') as TaskLabel[]) : undefined
          },
          priority: {
            in: priority ? (priority.split('.') as TaskPriority[]) : undefined
          },
          status: {
            in: status ? (status.split('.') as TaskStatus[]) : undefined
          },
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          OR:
            typeof title === 'string'
              ? [
                  {
                    title: {
                      contains: title
                    }
                  },
                  {
                    body: {
                      contains: title
                    }
                  }
                ]
              : undefined
        }
      })
    ]);

    const pageCount = Math.ceil(total / per_page);

    const data = rawData.map((task) => {
      const { project, ...taskWithoutProject } = task;
      return {
        ...taskWithoutProject,
        project: project ? project.name : ''
      };
    });

    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}
