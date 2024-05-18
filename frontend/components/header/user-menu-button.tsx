'use client';

import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserBasicData } from '@/lib/definitions';
import { ListItem } from './list-item';
import { Locale } from '@/i18n.config';

export function UserMenuButton({
  user,
  lang,
}: {
  user: UserBasicData | undefined;
  lang: Locale;
}) {
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
                href="/profile"
                lang={lang}
              />
              <ListItem
                className="text-right"
                title="Выйти"
                href="/ru/logout"
                lang={lang}
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
