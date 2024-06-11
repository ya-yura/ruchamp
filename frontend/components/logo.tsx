import { Locale } from '@/i18n.config';
import { CustomLink } from './custom-link';
import LogoIcon from '@/public/ru/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

export function Logo({ lang }: { lang: Locale }) {
  return (
    <CustomLink href={`/`} lang={lang}>
      <div className="flex items-center justify-start gap-3">
        <Image src={LogoIcon} alt="Логотип" />
        {/* <h5 className="text-lg font-black text-white sm:text-2xl">RUCHAMP</h5> */}
      </div>
    </CustomLink>
  );
}
 