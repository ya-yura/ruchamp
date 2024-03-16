import Image from 'next/image';
import { MenuItemLinkNavigation } from './buttons';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { CustomLink } from '@/app/[lang]/ui/custom-link';
import { LanguageSwitcher } from './lang-switcher';
import { aboutDropdown, comunityDropdown } from '@/lib/constants';
import { ButtonWithLink } from '../custom-buttons';

export async function Header({ lang }: { lang: Locale }) {
  const { header } = await getDictionary(lang);
  const { common } = await getDictionary(lang);

  return (
    <header className="sticky left-0 top-0 z-10 flex h-14 w-full flex-row items-center justify-between bg-black px-4">
      <CustomLink href={`/`} lang={lang}>
        <Image src="/ru/logo.svg" alt={common.logo} width={100} height={24} />
      </CustomLink>

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
          <li>
            <ButtonWithLink
              lang={lang}
              href="/login"
              appearance="primary"
              size="medium"
            >
              {header.buttons.login}
            </ButtonWithLink>
          </li>
          <li>
            <ButtonWithLink
              lang={lang}
              href="/register"
              appearance="secondary"
              size="medium"
            >
              {header.buttons.createAccount}
            </ButtonWithLink>
          </li>
        </ul>
      </nav>
      <div className="lang-switcher">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
