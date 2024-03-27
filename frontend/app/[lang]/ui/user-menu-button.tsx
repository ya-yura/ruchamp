'use client';

import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { ButtonWithLink } from './custom-buttons';
import { Locale } from '@/i18n.config';
import { signOut } from 'next-auth/react';
import { makeStyles } from '@fluentui/react-components';

const useOverrides = makeStyles({
  item: {
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
  },
});

export function UserMenuButton({ lang }: { lang: Locale }) {
  const overrides = useOverrides();

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          as="button"
          menuIcon={<Arrow />}
          appearance="transparent"
          size="large"
          icon={
            <Avatar
              name="Katri Athokas"
              image={{
                src: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/KatriAthokas.jpg',
              }}
            />
          }
        >
          user@mail.com
        </MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem className={overrides.item}>
            <ButtonWithLink
              lang={lang}
              href={`/profile`}
              appearance="transparent"
              size="large"
            >
              Профиль
            </ButtonWithLink>
          </MenuItem>
          <MenuItem className={overrides.item}>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              appearance="transparent"
              size="large"
            >
              Выйти
            </Button>
          </MenuItem>
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
