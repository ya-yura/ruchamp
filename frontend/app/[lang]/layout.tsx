import type { Metadata } from 'next';
import { inter } from '@/app/[lang]/ui/fonts';
import '@/app/[lang]/ui/global.css';
import { Providers } from './providers';
import { Locale, i18n } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Спортплатформа',
  description:
    'Онлайн-платформа для организации, регистрации и участия в соревнованиях и мероприятиях в сфере боевых искусств. Платформа обеспечивает удобное взаимодействие организаторов мероприятий, соревнующихся и зрителей, предоставляя всестороннюю функциональность для планирования, управления и участия в событиях. ',
    icons: {
      icon: '/ru/favicon.ico',
      apple: '/ru/apple-touch-icon.png',
      other: [
        {
          rel: 'icon',
          url: '/ru/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          rel: 'icon',
          url: '/ru/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          rel: 'icon',
          url: '/ru/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
        rel: 'icon',
        url: '/ru/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
          rel: 'manifest',
          url: '/ru/site.webmanifest',
        },
      ],
    },
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
        className={`${inter.className} relative mx-auto w-full bg-primary-background antialiased`}
        // suppressHydrationWarning={false} // To switch off warnings
      >
        <Providers dictionary={dictionary}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
