'use client';

import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../ui/header/header';
import { Footer } from '../ui/footer/footer';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import { useUserStore } from '@/lib/store/user';

export default function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  // const session = await getServerSession(authOptions);
  // const token = session?.user?.name as string;
  // const user = await auth.getCurrentUser(token);

  // if (!user) {
  //   redirect('/');
  // }

  const user = useUserStore((state) => state.user);

  console.log(user);

  return (
    <div>
      <Header lang={params.lang} user={user} />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
