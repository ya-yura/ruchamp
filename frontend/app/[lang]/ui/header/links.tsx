'use client';

import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuPopover,
} from '@fluentui/react-components';
import { TypeLinksDropdown } from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { ButtonWithLink } from '../custom-buttons';

export const MenuItemLinkNavigation = ({
  lang,
  title,
  url,
  dropDownLinks,
}: {
  lang: Locale;
  title: string;
  url?: string;
  dropDownLinks?: TypeLinksDropdown[];
}) =>
  dropDownLinks ? (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button appearance="transparent" size="large">
          {title}
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {dropDownLinks.map((item) => (
            <ButtonWithLink
              key={item.url}
              lang={lang}
              href={`${item.url}`}
              appearance="transparent"
              size="large"
            >
              {item.name}
            </ButtonWithLink>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  ) : (
    <ButtonWithLink
      lang={lang}
      href={`${url}`}
      appearance="transparent"
      size="large"
    >
      {title}
    </ButtonWithLink>
  );
