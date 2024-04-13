'use client';

import {
  Button,
  Menu,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { IconArrow } from '../icons';
import { Locale } from '@/i18n.config';

export default function HeaderNavigation({ lang }: { lang: Locale }) {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          size="medium"
          iconPosition="after"
          appearance="outline"
          icon={<IconArrow />}
        >
          Навигация
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <nav>
          <MenuList>
            <MenuItemLink href={`/${lang}/event`}>Событие</MenuItemLink>
            <MenuItemLink href={`/${lang}/events`}>События</MenuItemLink>
            <MenuItemLink href={`/${lang}/dashboard`}>Dashboard</MenuItemLink>
          </MenuList>
        </nav>
      </MenuPopover>
    </Menu>
  );
}
