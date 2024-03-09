'use client';

import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItemLink,
  MenuPopover,
} from '@fluentui/react-components';
import Link from 'next/link';
import { TypeLinksDropdown } from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { CustomLink } from '../custom-link';

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
            // <MenuItemLink href={`${item.url}`} key={item.name}>
            //   {item.name}
            // </MenuItemLink>
            <Button key={item.name}  appearance="transparent" size="large">
              <CustomLink href={`${item.url}`} lang={lang}>
                {item.name}
              </CustomLink>
            </Button>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  ) : (
    <Button appearance="transparent" size="large">
      <CustomLink href={`${url}`} lang={lang}>
        {title}
      </CustomLink>
    </Button>
  );

export const AuthButton = ({
  type,
  lang,
}: {
  type: 'login' | 'create account';
  lang: Locale;
}) => (
  <Button appearance={type === 'login' ? 'primary' : 'secondary'} size="medium">
    <Link href={type === 'login' ? `/${lang}/login` : `/${lang}/register`}>
      {type === 'login' ? 'Войти' : 'Создать аккаунт'}
    </Link>
  </Button>
);
