'use client';

import { Locale } from '@/i18n.config';
import { Button } from '../ui/button';
import { KeysIcon, PersonBoardIcon } from '../icons';
import { CustomLink } from '../custom-link';

export function AuthButtons({ lang }: { lang: Locale }) {
  return (
    <div className="flex gap-1 lg:gap-4">
      <CustomLink href={`/register`} lang={lang}>
        <Button
          className="hidden h-9 gap-2 px-3 sm:flex"
          variant="ruchampDefault"
        >
          <PersonBoardIcon />{' '}
          <p className="hidden md:block">Зарегистрироваться</p>
        </Button>
      </CustomLink>
      <CustomLink href={`/login`} lang={lang}>
        <Button
          className="flex h-9 gap-2 bg-transparent px-2.5 sm:border-none sm:bg-white"
          variant="outline"
        >
          <KeysIcon className="fill-[#616161]" />{' '}
          <p className="hidden md:block">Войти</p>
        </Button>
      </CustomLink>
    </div>
  );
}
