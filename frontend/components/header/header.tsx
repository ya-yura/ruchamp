import { Locale } from '@/i18n.config';
import { Logo } from '../logo';
import { UserMenuButton } from './user-menu-button';
import { HeaderNavigation } from './navigation';
import { SearchBar } from './search-box';
import { AuthButtons } from './auth-buttons';
import { ContentWraper } from '../content-wraper';
import { Button } from '../ui/button';
import { MagniglassIcon } from '../icons';
import { MenuWithButton } from './menu-with-button';

export function Header({ lang, user }: { lang: Locale; user: any }) {
  //fix "any" later
  const userCommonData =
    user &&
    user.find((item: object) => Object.keys(item).includes('User'))['User'];

  return (
    <header className="relative z-10 flex items-center justify-between bg-transparent px-4 py-3 sm:px-7 md:px-10 lg:px-[72px]">
      <ContentWraper>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <MenuWithButton />
            <div className="flex h-14 items-center justify-start pr-2 lg:pr-10">
              <Logo lang={lang} />
            </div>
            <div className="hidden h-[55px] items-center justify-end border-l-2 border-neutral-600 pl-2 sm:flex">
              <HeaderNavigation lang={lang} user={user} />
            </div>
          </div>
          <SearchBar className="mx-3 hidden lg:block" />
          <Button
            className="ml-auto h-9 sm:mr-1 lg:hidden"
            variant="ruchampTransparentGreyBorder"
            size="icon"
          >
            <MagniglassIcon />
          </Button>
          {user ? (
            <>
              {/* Не удалять */}
              {/* <LanguageSwitcher /> */}
              <UserMenuButton user={userCommonData} />
            </>
          ) : (
            <AuthButtons lang={lang} />
          )}
        </div>
      </ContentWraper>
    </header>
  );
}
