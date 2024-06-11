import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Locale } from '@/i18n.config';
import { path } from '@/lib/utils/other-utils';
import { getSession } from '@/lib/actions/auth';
import { Logo } from '@/components/logo';

export default async function AuthLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  if (session) {
    redirect(path(lang, '/events'));
  }

  return (
    <main className="absolute left-0 top-0 h-[100vh] w-full bg-primary-background">
      <Image
        className="relative opacity-50"
        src="/ru/images/background-auth.jpeg"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <div className=" absolute z-10 pt-[15px] sm:pl-7 md:pl-10   lg:pl-[72px]">
        <Logo lang={lang} />
      </div>

      <div className="relative grid h-full w-full grid-cols-1 md:grid-cols-[3fr_5fr] lg:grid-cols-[1fr_1fr]">
        {children}
      </div>
    </main>
  );
}
