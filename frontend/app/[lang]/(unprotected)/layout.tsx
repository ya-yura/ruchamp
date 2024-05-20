import '@/app/[lang]/ui/global.css';
import { Locale } from '@/i18n.config';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { getSession } from '@/lib/actions';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';

export default async function UnprotectedLayout({
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

  return (
    <>
      <Header
        userEmail={userEmail}
        userAvatar={userAvatar}
        initials={initials}
        isLoggedIn={!!session}
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
