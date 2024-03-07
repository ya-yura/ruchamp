import type { Metadata } from 'next';
import { inter } from '@/app/ui/fonts';
import '@/app/ui/global.css';

// import of Fluent UI React v9 provider
import { Providers } from './providers';
import { Header } from './ui/header/header';
import { Footer } from './ui/footer/footer';

export const metadata: Metadata = {
  title: 'РуЧамп',
  description:
    'Онлайн-платформа для организации, регистрации и участия в соревнованиях и мероприятиях в сфере боевых искусств. Платформа обеспечивает удобное взаимодействие организаторов мероприятий, соревнующихся и зрителей, предоставляя всестороннюю функциональность для планирования, управления и участия в событиях. ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.className} antialiased bg-black`}
        suppressHydrationWarning={true} // To switch off warnings such as "Warning: Extra attributes from the server: data-tabster,style"
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
