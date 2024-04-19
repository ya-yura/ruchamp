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

export function HeaderNavigation({ lang, user }: { lang: Locale; user: any }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9 cursor-pointer border bg-transparent py-1 px-2 sm:px-4">
            Навигация
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[180px] flex-col justify-end gap-1 p-1 ">
              <ListItem className='text-right' title="События" href="/ru/events" />
              {user ? (
                <ListItem className='text-right' title="Панель управления" href="/ru/dashboard" />
              ) : (
                <>
                  <ListItem className='text-right' title="Регистрация" href="/ru/register" />
                  <ListItem className='text-right' title="Войти" href="/ru/login" />
                </>
              )}
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
