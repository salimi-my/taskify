import * as z from 'zod';
import type { Prisma, UserRole } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/lib/db';
import { FilterSchema } from '@/schemas';

type UserWithProvider = Prisma.UserGetPayload<{
  include: {
    Account: {
      select: {
        provider: true;
      };
    };
  };
}>;

interface ReturnData {
  data: UserWithProvider[];
  pageCount: number;
}

export async function getUsers(
  filters: z.infer<typeof FilterSchema>
): Promise<ReturnData> {
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
    ]) as [keyof UserWithProvider | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Define orderBy
    const orderBy:
      | { [key: string]: 'asc' | 'desc' }
      | { [key: string]: { [key: string]: 'asc' | 'desc' } } =
      column &&
      ['name', 'email', 'Account_provider', 'role', 'createdAt'].includes(
        column
      )
        ? column.split('_').length > 1
          ? order === 'asc'
            ? {
                [column.split('_')[0]]: {
                  [column.split('_')[1]]: 'asc'
                }
              }
            : {
                [column.split('_')[0]]: {
                  [column.split('_')[1]]: 'desc'
                }
              }
          : order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      db.user.findMany({
        skip: offset,
        take: limit,
        include: {
          Account: {
            select: {
              provider: true
            }
          }
        },
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
