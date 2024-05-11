import {
  Users,
  Settings,
  LayoutGrid,
  FolderOpen,
  SquareCheck
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname.includes('/dashboard'),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/projects?page=1&sort=createdAt.desc',
          label: 'Projects',
          active: pathname.includes('/projects'),
          icon: FolderOpen,
          submenus: []
        },
        {
          href: '',
          label: 'Tasks',
          active: pathname.includes('/tasks'),
          icon: SquareCheck,
          submenus: [
            {
              href: '/tasks?page=1&sort=createdAt.desc',
              label: 'All Tasks',
              active: pathname === '/tasks'
            },
            {
              href: '/tasks/create',
              label: 'New Task',
              active: pathname === '/tasks/create'
            }
          ]
        }
      ]
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users?page=1&sort=createdAt.desc',
          label: 'Users',
          active: pathname.includes('/users'),
          icon: Users,
          submenus: []
        },
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
