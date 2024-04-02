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

export default function HeaderNavigation() {
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
            <MenuItemLink href="/event">Событие</MenuItemLink>
            <MenuItemLink href="/events">События</MenuItemLink>
            <MenuItemLink href="/dashboard">Dashboard</MenuItemLink>
          </MenuList>
        </nav>
      </MenuPopover>
    </Menu>
  );
}
