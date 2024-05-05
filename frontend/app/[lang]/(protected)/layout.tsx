import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';
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
  let user;
  if (!session || session.user.length === 0) {
    user === null;
  } else user = session.user;

  if (!session) {
    redirect('/ru');
  }

  return (
    <div>
      <Header lang={params.lang} user={user} />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
