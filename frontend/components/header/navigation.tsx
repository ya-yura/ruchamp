'use client';

import {
  Button,
  Menu,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { ArrowIcon } from '../icons';
import { Locale } from '@/i18n.config';

export default function HeaderNavigation({
  lang,
  user,
}: {
  lang: Locale;
  user: any;
}) {
  // fix "any" type
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          size="medium"
          iconPosition="after"
          appearance="outline"
          icon={<ArrowIcon />}
        >
          Навигация
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <nav>
          <MenuList>
            <MenuItemLink href={`/${lang}/events`}>События</MenuItemLink>
            {user && (
              <>
                <MenuItemLink href={`/${lang}/dashboard`}>
                  Dashboard
                </MenuItemLink>
              </>
            )}
          </MenuList>
        </nav>
      </MenuPopover>
    </Menu>
  );
}
