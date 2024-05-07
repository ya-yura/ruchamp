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
import { UserBasicData } from '@/lib/definitions';

export function UserMenuButton({ user }: { user: UserBasicData | undefined }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="data-[active]:text-primary-mainAccent data-[state=open]:text-primary-mainAccent flex h-9 gap-2 border-none bg-transparent px-0 py-1 text-base font-semibold text-background hover:bg-transparent hover:text-background data-[active]:bg-transparent data-[state=closed]:bg-transparent data-[state=open]:bg-transparent data-[state=closed]:text-background">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="hidden sm:block">{user?.email}</p>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
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
