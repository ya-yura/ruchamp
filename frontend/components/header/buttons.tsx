'use client';

import { Locale } from '@/i18n.config';
import { Button } from '../ui/button';
import Link from 'next/link';
import { KeysIcon, PersonBoardIcon } from '../icons';

export function AuthButtons({ lang }: { lang: Locale }) {
  return (
    <div className="hidden gap-1 sm:gap-4 sm:flex">
      <Link href={`/${lang}/register`}>
        <Button className="flex h-9 gap-2" variant="ruchampDefault">
          <PersonBoardIcon />{' '}
          <p className="hidden md:inline">Зарегистрироваться</p>
        </Button>
      </Link>
      <Link href={`/${lang}/login`}>
        <Button className="flex h-9 gap-2" variant="outline">
          <KeysIcon /> <p className="hidden md:inline">Войти</p>
        </Button>
      </Link>
    </div>
  );
}
