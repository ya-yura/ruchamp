import '@/app/[lang]/ui/global.css';
import { Locale } from '@/i18n.config';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils/text-utils';
import { path } from '@/lib/utils/other-utils';
import { auth } from '@/lib/api/auth';
import { UserInfo } from '@/lib/definitions';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  const token = session?.token;
  const profile = await auth.getCurrentUser(token);

  const user: UserInfo | null = session
    ? {
        basicInfo: profile[1],
        roleInfo: profile[0],
      }
    : null;

  const initials = getInitials(user?.basicInfo.name, user?.basicInfo.sirname);

  if (!session) {
    redirect(path(params.lang, '/login'));
  }

  return (
    <div>
      <Header
        userEmail={user?.basicInfo.email}
        userAvatar={user?.roleInfo.image_field}
        initials={initials}
        isLoggedIn={!!session}
        roleId={user?.basicInfo.role_id}
        lang={params.lang}
      />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
