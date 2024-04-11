import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '../ui/header/header';
import { Footer } from '../ui/footer/footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;
  const user = await auth.getCurrentUser(token);

  if (!user) {
    redirect('/');
  }

  return (
    <div>
      <Header lang={params.lang} user={user} />
      {children}
      <Footer lang={params.lang} />
    </div>
  );
}
