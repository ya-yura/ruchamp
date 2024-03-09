import Image from 'next/image';
import { AuthButton, MenuItemLinkNavigation } from './buttons';
import Link from 'next/link';
import { TypeLinksDropdown } from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { CustomLink } from '@/app/[lang]/ui/custom-link';
import { LanguageSwitcher } from './lang-switcher';

const aboutDropdown: TypeLinksDropdown[] = [
  {
    name: 'Link 1',
    url: '/bla1',
  },
  {
    name: 'Link 2',
    url: '/bla2',
  },
  {
    name: 'Link 3',
    url: '/bla3',
  },
];

const comunityDropdown: TypeLinksDropdown[] = [
  {
    name: 'Link 4',
    url: '/bla4',
  },
  {
    name: 'Link 5',
    url: '/bla5',
  },
];

export async function Header({ lang }: { lang: Locale }) {
  const { header } = await getDictionary(lang);

  return (
    <header className="w-full h-14 px-4 bg-black flex flex-row items-center justify-between sticky top-0 left-0 z-10">
      <CustomLink href={`/`} lang={lang}>
        <Image
          src="/ru/logo.svg"
          alt="Логотип РуЧамп"
          // className="dark:invert"
          width={100}
          height={24}
          // priority
        />
      </CustomLink>

      <nav className="flex items-center justify-center ml-auto mr-7">
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
              dropDownLinks={aboutDropdown}
            />
          </li>
          <li>
            <MenuItemLinkNavigation
              lang={lang}
              title={header.navigation.community}
              dropDownLinks={comunityDropdown}
            />
          </li>
          <li>
            <AuthButton lang={lang} type="login" />
          </li>
          <li>
            <AuthButton lang={lang} type="create account" />
          </li>
        </ul>
      </nav>
      <div className="lang-switcher">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
