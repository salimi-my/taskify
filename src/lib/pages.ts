import { LayoutGrid, Users, SquareCheck, UserCog } from 'lucide-react';

export function getPages(pathname: string) {
  return [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
      icon: LayoutGrid,
      menu: true,
      submenus: []
    },
    {
      href: '',
      label: 'Tasks',
      active: pathname.includes('/tasks'),
      icon: SquareCheck,
      menu: true,
      submenus: [
        {
          href: '/tasks',
          label: 'All Tasks',
          active: pathname === '/tasks'
        },
        {
          href: '/projects/new',
          label: 'New Task',
          active: pathname === '/projects/new'
        }
      ]
    },
    {
      href: '/users?page=1&sort=createdAt.desc',
      label: 'Users',
      active: pathname.includes('/users'),
      icon: Users,
      menu: true,
      submenus: []
    },
    {
      href: '/account',
      label: 'Account',
      active: pathname === '/account',
      icon: UserCog,
      menu: true,
      submenus: []
    }
  ];
}
