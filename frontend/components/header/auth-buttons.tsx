'use client';

import { Locale } from '@/i18n.config';
import { Button } from '../ui/button';
import Link from 'next/link';
import { KeysIcon, PersonBoardIcon } from '../icons';

export function AuthButtons({ lang }: { lang: Locale }) {
  return (
    <div className="flex gap-1 lg:gap-4">
      <Link href={`/${lang}/register`}>
        <Button
          className="hidden h-9 gap-2 px-3 sm:flex"
          variant="ruchampDefault"
        >
          <PersonBoardIcon />{' '}
          <p className="hidden md:block">Зарегистрироваться</p>
        </Button>
      </Link>
      <Link href={`/${lang}/login`}>
        <Button
          className="flex h-9 gap-2 border-[#616161] bg-transparent px-2.5 sm:border-none sm:bg-white"
          variant="outline"
        >
          <KeysIcon className="fill-[#616161]" />{' '}
          <p className="hidden md:block">Войти</p>
        </Button>
      </Link>
    </div>
  );
}
