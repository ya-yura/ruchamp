import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions';
import { getInitials, path } from '@/lib/utils';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  let userEmail: string;
  let userAvatar: string;
  let initials: string;
  if (!session || session.user.length === 0) {
    userEmail = '';
    userAvatar = '';
    initials = '';
  } else {
    const user = session.user;
    const firstName: string = user[1].name;
    const lastName: string = user[1].sirname;
    userEmail = user[1].email;
    userAvatar = user[0].image_field;
    initials = getInitials(firstName, lastName);
  }

  if (!session) {
    redirect(path(params.lang, '/login'));
  }

  return (
    <div>
      <Header
        userEmail={userEmail}
        userAvatar={userAvatar}
        initials={initials}
        isLoggedIn={!!session}
        lang={params.lang}
      />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
