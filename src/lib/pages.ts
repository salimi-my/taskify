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

export function getPages(pathname: string): Group[] {
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
          href: '',
          label: 'Projects',
          active: pathname.includes('/projects'),
          icon: FolderOpen,
          submenus: [
            {
              href: '/projects?page=1&sort=createdAt.desc',
              label: 'All Projects',
              active: pathname === '/projects'
            },
            {
              href: '/projects/new',
              label: 'New Project',
              active: pathname === '/projects/new'
            }
          ]
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
              href: '/tasks/new',
              label: 'New Task',
              active: pathname === '/tasks/new'
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
