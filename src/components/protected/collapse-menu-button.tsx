'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Dot, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

export default function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className='w-full'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          className='w-full justify-start h-10'
        >
          <div className='w-full items-center flex justify-between'>
            <div className='flex items-center'>
              <span className='mr-4'>
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  'whitespace-nowrap',
                  isOpen ? 'opacity-100' : 'opacity-0'
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                'whitespace-nowrap',
                isOpen ? 'opacity-100' : 'opacity-0'
              )}
            >
              {isCollapsed ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={active ? 'secondary' : 'ghost'}
            className='w-full justify-start h-10'
            asChild
          >
            <Link href={href}>
              <span className='mr-4'>
                <Dot size={18} />
              </span>
              <p
                className={cn(
                  'whitespace-nowrap',
                  isOpen ? 'opacity-100' : 'opacity-0'
                )}
              >
                {label}
              </p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                className='w-full justify-start h-10'
              >
                <div className='w-full items-center flex justify-between'>
                  <div className='flex items-center'>
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
                  </div>
                  <div
                    className={cn(
                      'whitespace-nowrap',
                      isOpen ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {isCollapsed ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='right'>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side='right' sideOffset={25} align='start'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className='cursor-pointer' href={href}>
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className='fill-border' />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
