import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../ui/header/header';
import { Footer } from '../ui/footer/footer';
import { getSession } from '@/lib/actions';

export default async function UnprotectedLayout({
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

  return (
    <div>
      <Header lang={params.lang} user={user} />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
