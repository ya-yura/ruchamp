'use client';

import { Locale } from '@/i18n.config';
// import { getDictionary } from '@/lib/dictionary';
import Logo from '../logo';
import { UserMenuButton } from './user-menu-button';
import HeaderNavigation from './navigation';
import SearchBar from './search-box';
import { useUserStore } from '@/lib/store/user';
import { ButtonWithLink } from '../custom-buttons';
import {
  KeyMultiple20Regular,
  PersonBoard20Regular,
} from '@fluentui/react-icons';
import { Divider, makeStyles, tokens } from '@fluentui/react-components';

const useOverrides = makeStyles({
  button: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    color: tokens.colorNeutralForegroundInverted,
  },
});

export function Header({ lang }: { lang: Locale }) {
  // const { header } = await getDictionary(lang);
  // const { common } = await getDictionary(lang);
  const user = useUserStore((store) => store.user);
  const overrides = useOverrides();

  return (
    <header className="relative z-10 flex items-center justify-between bg-transparent px-[72px] py-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex h-14 items-center justify-start pr-12">
          <Logo lang={lang} />
        </div>

        {user ? (
          <>
            <div className="flex h-[55px] items-center justify-end border-l-2 border-neutral-600 pl-4">
              <HeaderNavigation />
            </div>
            <SearchBar />
            <div className="ml-auto flex items-center justify-end gap-5">
              {/* <LanguageSwitcher /> */}
              <UserMenuButton />
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <ButtonWithLink
              lang={lang}
              href="/register"
              size="medium"
              appearance="primary"
              icon={<PersonBoard20Regular />}
            >
              Регистрироваться
            </ButtonWithLink>
            <ButtonWithLink
              className={overrides.button}
              lang={lang}
              href="/login"
              size="medium"
              appearance="secondary"
              icon={<KeyMultiple20Regular />}
            >
              Войти
            </ButtonWithLink>
          </div>
        )}

        {/* <nav className="ml-auto flex items-center justify-center">
          <ul className="flex flex-row items-center justify-start gap-2">
            <li>
              <MenuItemLinkNavigation
                lang={lang}
                title={header.navigation.events}
                url={`/events`}
              />
            </li>
            <li>
              <MenuItemLinkNavigation
                lang={lang}
                title={header.navigation.about}
                dropDownLinks={aboutDropdown} //temporary mock data
              />
            </li>
            <li>
              <MenuItemLinkNavigation
                lang={lang}
                title={header.navigation.community}
                dropDownLinks={comunityDropdown} //temporary mock data
              />
            </li>
            <AuthButtons lang={lang} />
          </ul>
        </nav> */}
      </div>
    </header>
  );
}
