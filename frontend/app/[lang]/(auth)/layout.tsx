import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Locale } from '@/i18n.config';
import { path } from '@/lib/utils/other-utils';
import { getSession } from '@/lib/actions/auth';
import { Logo } from '@/components/logo';
import { ContentWraper } from '@/components/content-wraper';

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
        alt=""
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute w-full px-4 pt-[10px] sm:px-7 sm:pt-[15px] md:px-10 lg:px-[72px]">
        <ContentWraper>
          <Logo lang={lang} />
        </ContentWraper>
      </div>
      <div className="xl:mx-custom-calc relative grid h-full w-full grid-cols-1 md:grid-cols-[3fr_5fr] lg:grid-cols-[0.7fr_1fr]">
        {children}
      </div>
    </main>
  );
}
