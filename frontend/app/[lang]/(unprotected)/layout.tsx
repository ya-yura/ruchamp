import '@/app/[lang]/ui/global.css';
import { Locale } from '@/i18n.config';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import Image from 'next/image';
import { getInitials } from '@/lib/utils/text-utils';
import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { auth } from '@/lib/api/auth';

export default async function UnprotectedLayout({
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

  return (
    <>
      <Header
        userEmail={user?.basicInfo.email}
        userAvatar={user?.roleInfo.image_field}
        initials={initials}
        isLoggedIn={!!session}
        roleId={user?.basicInfo.role_id}
        lang={params.lang}
      />
      <div className="absolute mt-[-92px] h-[853px] w-full ">
        <Image
          className="opacity-40"
          src="/ru/images/background-events.jpeg"
          alt=""
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-[rgba(0,0,0,0.01)] from-50% to-primary-background to-100%"></div>
      </div>
      {children}
      <Footer lang={params.lang} />
    </>
  );
}
