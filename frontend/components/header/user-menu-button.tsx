'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Locale } from '@/i18n.config';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function UserMenuButton({ user }: { user: any }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="flex h-9 gap-2 border-none bg-transparent py-1 text-base font-semibold text-[#424242] hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent data-[active]:text-[#0F6CBD] data-[state=open]:text-[#0F6CBD]">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="hidden sm:block">{user.email}</p>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="flex w-[100px] flex-col gap-1 p-1 ">
              <ListItem
                className="text-right"
                title="Профиль"
                href="/ru/profile"
              />
              <ListItem
                className="text-right"
                title="Выйти"
                href="/ru/logout"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
