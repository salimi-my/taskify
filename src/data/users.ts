import * as z from 'zod';
import type { User, UserRole } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/lib/db';
import { UserFilterSchema } from '@/schemas';

type UserWithProvider = User & {
  provider: String;
};

interface ReturnData {
  data: UserWithProvider[];
  pageCount: number;
}

export async function getUsers(
  filters: z.infer<typeof UserFilterSchema>
): Promise<ReturnData> {
  noStore();
  const { page, per_page, sort, name, role, provider, from, to } = filters;

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

    // Configure AND clause
    let andClause = [];
    if (name) {
      andClause.push({
        OR: [{ name: { contains: name } }, { email: { contains: name } }]
      });
    }
    if (provider) {
      const providerList = provider
        .split('.')
        .filter((p) => p !== 'credentials');

      if (providerList.length === 0) {
        andClause.push({
          account: null
        });
      } else {
        const providerFilter = {
          account: {
            provider: {
              in: providerList
            }
          }
        };

        if (provider.split('.').includes('credentials')) {
          andClause.push({
            OR: [{ account: null }, providerFilter]
          });
        } else {
          andClause.push(providerFilter);
        }
      }
    }

    // Define orderBy
    const orderBy:
      | { [key: string]: 'asc' | 'desc' }
      | { [key: string]: { [key: string]: 'asc' | 'desc' } } =
      column &&
      ['name', 'email', 'provider', 'role', 'createdAt'].includes(column)
        ? column === 'provider'
          ? order === 'asc'
            ? {
                ['account']: {
                  [column]: 'asc'
                }
              }
            : {
                ['account']: {
                  [column]: 'desc'
                }
              }
          : order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { createdAt: 'desc' };

    const [rawData, total] = await Promise.all([
      db.user.findMany({
        skip: offset,
        take: limit,
        include: {
          account: {
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
          AND: andClause.length > 0 ? andClause : undefined
        },
        orderBy
      }),
      db.user.count({
        where: {
          role: {
            in: role ? (role.split('.') as UserRole[]) : undefined
          },
          createdAt: {
            gte: fromDay,
            lte: toDay
          },
          AND: andClause.length > 0 ? andClause : undefined
        },
        orderBy
      })
    ]);

    const pageCount = Math.ceil(total / per_page);

    const data = rawData.map((user) => {
      const { account, ...userWithoutAccount } = user;
      return {
        ...userWithoutAccount,
        provider: account?.provider || 'credentials'
      };
    });

    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getAllUsers() {
  try {
    const users = await db.user.findMany();

    return users;
  } catch {
    return null;
  }
}
