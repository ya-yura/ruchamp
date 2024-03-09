import Link from 'next/link';
import { i18n } from '@/i18n.config';
import { CustomLinkProps } from '@/lib/definitions';

export function CustomLink({
  href,
  lang,
  children,
  ...props
}: CustomLinkProps) {
  const isDefaultLang = lang === i18n.defaultLocale;
  const path = isDefaultLang ? href : `/${lang}${href}`;
  return (
    <Link href={path} {...props}>
      {children}
    </Link>
  );
}
