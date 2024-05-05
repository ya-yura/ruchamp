import Link from 'next/link';
import { i18n } from '@/i18n.config';

interface CustomLinkProps extends React.RefAttributes<HTMLAnchorElement> {
  className?: string;
  href: string;
  lang: string;
  children: React.ReactNode;
}

export function CustomLink({
  className,
  href,
  lang,
  children,
  ...props
}: CustomLinkProps) {
  const isDefaultLang = lang === i18n.defaultLocale;
  const path = isDefaultLang ? href : `/${lang}${href}`;
  return (
    <Link className={className} href={path} {...props}>
      {children}
    </Link>
  );
}
