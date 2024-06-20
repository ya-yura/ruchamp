import { Locale } from '@/i18n.config';
import { CustomLink } from './custom-link';
import LogoIcon from '@/public/ru/images/logo.svg';
import Image from 'next/image';

export function Logo({ lang }: { lang: Locale }) {
  return (
    <CustomLink href={`/`} lang={lang}>
      <Image src={LogoIcon} alt="Логотип" />
    </CustomLink>
  );
}
