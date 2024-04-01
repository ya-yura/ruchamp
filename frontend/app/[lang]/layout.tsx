import type { Metadata } from 'next';
import { inter } from '@/app/[lang]/ui/fonts';
import '@/app/[lang]/ui/global.css';
import { Providers } from './providers'; //Fluent UI React v9 provider
import { Locale, i18n } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export const metadata: Metadata = {
  title: 'РуЧамп',
  description:
    'Онлайн-платформа для организации, регистрации и участия в соревнованиях и мероприятиях в сфере боевых искусств. Платформа обеспечивает удобное взаимодействие организаторов мероприятий, соревнующихся и зрителей, предоставляя всестороннюю функциональность для планирования, управления и участия в событиях. ',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <body
        className={`${inter.className} relative mx-auto max-w-7xl bg-[#0A0A0A] antialiased`}
        suppressHydrationWarning={true} // To switch off warnings such as "Warning: Extra attributes from the server: data-tabster,style"
      >
        <Providers dictionary={dictionary}>{children}</Providers>
      </body>
    </html>
  );
}
