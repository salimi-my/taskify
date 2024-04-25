'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { getPages } from '@/lib/pages';
import { Button } from '@/components/ui/button';
import CollapseMenuButton from '@/components/protected/collapse-menu-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const pages = getPages(pathname);

  return (
    <nav className='mt-8 h-full'>
      <ul className='flex flex-col h-full items-start space-y-1 px-2'>
        {pages
          .filter((page) => page.menu !== false)
          .map(({ href, label, icon: Icon, active, submenus }, index) =>
            submenus.length === 0 ? (
              <li className='w-full' key={index}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={active ? 'secondary' : 'ghost'}
                        className='w-full justify-start h-10'
                        asChild
                      >
                        <Link href={href}>
                          <span className={cn(isOpen === false ? '' : 'mr-4')}>
                            <Icon size={18} />
                          </span>
                          <p
                            className={cn(
                              'whitespace-nowrap',
                              isOpen === false ? 'opacity-0' : 'opacity-100'
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side='right'>{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            ) : (
              <CollapseMenuButton
                key={index}
                icon={Icon}
                label={label}
                active={active}
                submenus={submenus}
                isOpen={isOpen}
              />
            )
          )}
        <li className='w-full grow flex items-end'>
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => signOut()}
                  variant='outline'
                  className='w-full justify-center h-10 mt-4'
                >
                  <span className={cn(isOpen === false ? '' : 'mr-4')}>
                    <LogOut size={18} />
                  </span>
                  <p
                    className={cn(
                      'whitespace-nowrap',
                      isOpen === false ? 'opacity-0 hidden' : 'opacity-100'
                    )}
                  >
                    Sign out
                  </p>
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent side='right'>Sign out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
}
