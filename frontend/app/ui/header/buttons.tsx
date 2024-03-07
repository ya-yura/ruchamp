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
import { TypeLinksDropdown } from '@/app/lib/definitions';

export const MenuItemLinkNavigation = ({
  title,
  url,
  dropDownLinks,
}: {
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
            <MenuItemLink href={`${item.url}`} key={item.name}>
              {item.name}
            </MenuItemLink>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  ) : (
    <Button appearance="transparent" size="large">
      <Link href={`${url}`}>{title}</Link>
    </Button>
  );

export const AuthButton = ({ type }: { type: 'login' | 'create account' }) => (
  <Button appearance={type === 'login' ? 'primary' : 'secondary'} size="medium">
    <Link href={type === 'login' ? '/login' : '/register'}>
      {type === 'login' ? 'Войти' : 'Создать аккаунт'}
    </Link>
  </Button>
);
