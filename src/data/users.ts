import * as z from 'zod';
import type { User, UserRole } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/lib/db';
import { FilterSchema } from '@/schemas';

export async function getUsers(filters: z.infer<typeof FilterSchema>) {
  noStore();
  const { page, per_page, sort, name, role, from, to } = filters;

  try {
    // Number of items per page
    const limit = per_page;

    // Number of items to skip
    const offset = (page - 1) * per_page;

    // Column and order to sort
    const [column, order] = (sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc'
    ]) as [keyof User | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Define orderBy
    const orderBy: { [key: string]: 'asc' | 'desc' } =
      column && ['name', 'email', 'role', 'createdAt'].includes(column)
        ? order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      db.user.findMany({
        skip: offset,
        take: limit,
        where: {
          role: {
            in: role ? (role.split('.') as UserRole[]) : undefined
          },
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          OR: name
            ? [
                {
                  name: {
                    contains: name
                  }
                },
                {
                  email: {
                    contains: name
                  }
                }
              ]
            : undefined
        },
        orderBy
      }),
      db.user.count({
        where: {
          OR:
            typeof name === 'string'
              ? [
                  {
                    name: {
                      contains: name
                    }
                  },
                  {
                    email: {
                      contains: name
                    }
                  }
                ]
              : undefined
        },
        orderBy
      })
    ]);

    const pageCount = Math.ceil(total / per_page);

    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}
