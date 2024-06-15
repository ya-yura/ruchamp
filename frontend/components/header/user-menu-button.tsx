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
import { ListItem } from './list-item';
import { Locale } from '@/i18n.config';
import { EnumUserRole } from '@/lib/definitions';
import { userRoles } from '@/lib/constants';

interface UserMenuButtonProps {
  userEmail: string;
  userAvatar: string | null;
  initials: string;
  roleId: number;
  lang: Locale;
}

export function UserMenuButton({
  userEmail,
  userAvatar,
  initials,
  roleId,
  lang,
}: UserMenuButtonProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="group flex h-9 gap-2 border-none bg-transparent px-0 py-1 text-base font-semibold hover:bg-transparent hover:text-background data-[active]:bg-transparent data-[state=closed]:bg-transparent data-[state=open]:bg-transparent data-[active]:text-primary-mainAccent data-[state=closed]:text-background data-[state=open]:text-primary-mainAccent">
            <Avatar className="h-8 w-8 text-foreground duration-300 group-hover:text-primary-mainAccent">
              {userAvatar && <AvatarImage src={userAvatar} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p className="hidden sm:block">{userEmail}</p>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[100px] flex-col gap-1 p-1 ">
              {userRoles['organizer'] === roleId?.toString() && (
                <ListItem
                  className="text-right"
                  title="Мои события"
                  href="/org/events"
                  lang={lang}
                />
              )}

              <ListItem
                className="text-right"
                title="Профиль"
                href="/profile"
                lang={lang}
              />
              <ListItem
                className="text-right"
                title="Выйти"
                href="/logout"
                lang={lang}
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
