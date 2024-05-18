import { Locale, i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ListItemProps {
  className: string;
  title: string;
  href: string;
  lang: Locale;
}

export function ListItem({
  className,
  title,
  href,
  lang,
  ...props
}: ListItemProps) {
  const isDefaultLang = lang === i18n.defaultLocale;
  const path = isDefaultLang ? href : `/${lang}${href}`;
  return (
    <li>
      <Link
        className={cn(
          'block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className,
        )}
        href={path}
        {...props}
      >
        <p className="text-sm font-medium leading-none">{title}</p>
      </Link>
    </li>
  );
}
