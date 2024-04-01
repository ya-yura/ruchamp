'use client';

import { useUserStore } from '@/lib/store/user';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';

const useOverrides = makeStyles({
  text: { color: tokens.colorNeutralForeground2 },
});

export function UserMenuButton() {
  const user = useUserStore((store) => store.user);
  const overriders = useOverrides();

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          className={overriders.text}
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
          {user?.email}
        </MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItemLink href="/profile">Профиль</MenuItemLink>
          <MenuItemLink href="/logout">Выйти</MenuItemLink>
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
