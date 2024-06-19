'use client';

import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Locale } from '@/i18n.config';
import { ListItem } from './list-item';

export function HeaderNavigation({
  lang,
  isLoggedIn,
}: {
  lang: Locale;
  isLoggedIn: boolean;
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9 cursor-pointer border bg-transparent px-2 py-1 data-[state=open]:border-white/70 data-[active]:bg-transparent data-[state=closed]:bg-transparent data-[state=open]:bg-transparent data-[active]:text-white data-[state=closed]:text-white data-[state=open]:text-white/70 sm:px-4">
            Навигация
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[180px] flex-col justify-end gap-1 p-1 ">
              <ListItem
                className="text-right"
                title="События"
                href="/events"
                lang={lang}
              />
              <ListItem
                className="text-right"
                title="Команды"
                href="/teams"
                lang={lang}
              />
              {isLoggedIn ? null : ( // add something later
                <>
                  <ListItem
                    className="text-right"
                    title="Регистрация"
                    href="/register"
                    lang={lang}
                  />
                  <ListItem
                    className="text-right"
                    title="Войти"
                    href="/login"
                    lang={lang}
                  />
                </>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
