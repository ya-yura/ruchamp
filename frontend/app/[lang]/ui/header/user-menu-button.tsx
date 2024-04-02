'use client';

import { TypeUser } from '@/lib/definitions';
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
import { IconArrow } from '../icons';

const useOverrides = makeStyles({
  text: { color: tokens.colorNeutralForeground2 },
});

export function UserMenuButton({ user }: { user: TypeUser }) {
  const overriders = useOverrides();

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          className={overriders.text}
          as="button"
          menuIcon={<IconArrow />}
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


