'use client';

import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { ButtonWithLink } from '../custom-buttons';
import { Locale } from '@/i18n.config';
import { makeStyles } from '@fluentui/react-components';

const useOverrides = makeStyles({
  menuItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
  },
});

export default function HeaderNavigation({ lang }: { lang: Locale }) {
  const overrides = useOverrides();
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button iconPosition="after" icon={<Arrow />}>
          События
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItemLink href="/event">Событие</MenuItemLink>
          <MenuItemLink href="/events">События</MenuItemLink>
          <MenuItemLink href="/login">Войти</MenuItemLink>
          <MenuItemLink href="/register">Регистрация</MenuItemLink>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

function Arrow() {
  return (
    <svg
      fill="currentColor"
      className=""
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
