import Image from 'next/image';
import { MenuItemLinkNavigation } from './links';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { CustomLink } from '@/app/[lang]/ui/custom-link';
import { LanguageSwitcher } from './lang-switcher';
import {
  aboutDropdown,
  comunityDropdown,
} from '@/app/[lang]/ui/header/constants';
import { AuthButtons } from './buttons';
import Logo from '../logo';
import { UserMenuButton } from '../user-menu-button';

export async function Header({ lang }: { lang: Locale }) {
  const { header } = await getDictionary(lang);
  const { common } = await getDictionary(lang);

  return (
    <header className="flex items-center justify-between bg-transparent px-[72px] py-3">
      <div className="flex items-center justify-start">
        <div className="flex h-14 items-center justify-start border-r-2 border-neutral-600 pr-12">
          <Logo lang={lang} />
        </div>
        <nav className="ml-auto flex items-center justify-center">
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
        </nav>
        <div className="lang-switcher">
          <LanguageSwitcher />
        </div>
      </div>
      <UserMenuButton lang={lang} />
    </header>
  );
}
