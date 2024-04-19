import { Locale } from '@/i18n.config';
import { Logo } from '../logo';
import { UserMenuButton } from './user-menu-button';
import { HeaderNavigation } from './navigation';
import { SearchBar } from './search-box';
import { AuthButtons } from './buttons';
import { ContentWraper } from '../content-wraper';

export function Header({ lang, user }: { lang: Locale; user: any }) {
  //fix "any" later
  const userCommonData =
    user &&
    user.find((item: object) => Object.keys(item).includes('User'))['User'];

  return (
    <header className="relative z-10 flex items-center justify-between bg-transparent px-4 py-3 sm:px-7 md:px-10 lg:px-[72px]">
      <ContentWraper>
        <div className="flex w-full items-center justify-between">
          <div className="flex">
            <div className="flex h-14 items-center justify-start pr-2 lg:pr-10">
              <Logo lang={lang} />
            </div>
            <div className="flex h-[55px] items-center justify-end border-l-2 border-neutral-600 pl-2">
              <HeaderNavigation lang={lang} user={user} />
            </div>
          </div>
          {user ? (
            <>
              <SearchBar className='hidden lg:block ml-3'/>
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
