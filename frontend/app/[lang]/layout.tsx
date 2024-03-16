import type { Metadata } from 'next';
import { inter } from '@/app/[lang]/ui/fonts';
import '@/app/[lang]/ui/global.css';
import { Header } from './ui/header/header';
import { Footer } from './ui/footer/footer';
import { Providers } from './providers'; //Fluent UI React v9 provider
import { Locale, i18n } from '@/i18n.config';

export const metadata: Metadata = {
  title: 'РуЧамп',
  description:
    'Онлайн-платформа для организации, регистрации и участия в соревнованиях и мероприятиях в сфере боевых искусств. Платформа обеспечивает удобное взаимодействие организаторов мероприятий, соревнующихся и зрителей, предоставляя всестороннюю функциональность для планирования, управления и участия в событиях. ',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang}>
      <body
        className={`${inter.className} antialiased bg-black`}
        suppressHydrationWarning={true} // To switch off warnings such as "Warning: Extra attributes from the server: data-tabster,style"
      >
        <Providers>
          <Header lang={params.lang} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
