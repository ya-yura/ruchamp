import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils/text-utils';
import { path } from '@/lib/utils/other-utils';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  let userEmail: string;
  let userAvatar: string | null;
  let initials: string;
  let roleId: number;
  if (!session) {
    userEmail = '';
    userAvatar = '';
    initials = '';
    roleId = 0;
  } else {
    const user = session.user;
    const firstName: string = user[1].name;
    const lastName: string = user[1].sirname;
    userEmail = user[1].email;
    userAvatar = user[0].image_field;
    initials = getInitials(firstName, lastName);
    roleId = user[1].role_id;
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
        roleId={roleId}
        lang={params.lang}
      />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
