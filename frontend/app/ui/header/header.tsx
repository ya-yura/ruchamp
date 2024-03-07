import Image from 'next/image';
import { AuthButton, MenuItemLinkNavigation } from './buttons';
import Link from 'next/link';
import { TypeLinksDropdown } from '@/app/lib/definitions';

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

export function Header() {
  return (
    <header className="w-full h-14 px-4 bg-black flex flex-row items-center justify-between sticky top-0 left-0 z-10">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Логотип РуЧамп"
          // className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </Link>

      <nav className="flex items-center justify-center">
        <ul className="flex flex-row items-center justify-start gap-2">
          <li>
            <MenuItemLinkNavigation title="События" url="/events" />
          </li>
          <li>
            <MenuItemLinkNavigation
              title="О нас"
              dropDownLinks={aboutDropdown}
            />
          </li>
          <li>
            <MenuItemLinkNavigation
              title="Сообщество"
              dropDownLinks={comunityDropdown}
            />
          </li>
          <li>
            <AuthButton type='login'/>
          </li>
          <li>
            <AuthButton type='create account'/>
          </li>
        </ul>
      </nav>
    </header>
  );
}
