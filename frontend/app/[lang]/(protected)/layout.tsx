import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../ui/header/header';
import { Footer } from '../ui/footer/footer';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  return (
    <div>
      <Header lang={params.lang} user={session.user} />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
