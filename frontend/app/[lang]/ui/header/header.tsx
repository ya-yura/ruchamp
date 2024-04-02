import { Locale } from '@/i18n.config';
import Logo from '../logo';
import { UserMenuButton } from './user-menu-button';
import HeaderNavigation from './navigation';
import SearchBar from './search-box';
import { TypeUser } from '@/lib/definitions';
import { AuthButtons } from './buttons';

export function Header({ lang, user }: { lang: Locale; user: TypeUser }) {
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
              {/* Не удалять */}
              {/* <LanguageSwitcher /> */}
              <UserMenuButton user={user} />
            </div>
          </>
        ) : (
          <AuthButtons lang={lang} />
        )}
      </div>
    </header>
  );
}
