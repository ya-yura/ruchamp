import Link from 'next/link';
import { i18n } from '@/i18n.config';

type TypeCustomLinkProps = {
  className?: string;
  href: string;
  lang: string;
  children: React.ReactNode;
} & React.RefAttributes<HTMLAnchorElement>;

export function CustomLink({
  className,
  href,
  lang,
  children,
  ...props
}: TypeCustomLinkProps) {
  const isDefaultLang = lang === i18n.defaultLocale;
  const path = isDefaultLang ? href : `/${lang}${href}`;
  return (
    <Link className={className} href={path} {...props}>
      {children}
    </Link>
  );
}
