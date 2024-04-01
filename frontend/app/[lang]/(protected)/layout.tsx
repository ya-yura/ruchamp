import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
// import { getDictionary } from '@/lib/dictionary';
import { Header } from '../ui/header/header';
import { Footer } from '../ui/footer/footer';

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
  //   const dictionary = await getDictionary(params.lang);

  return (
    <div>
      <Header lang={params.lang} />
      {children}
      <Footer />
    </div>
  );
}
