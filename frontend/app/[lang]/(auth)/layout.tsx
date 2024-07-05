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
      <div className="z-10 absolute w-full px-4 pt-[10px] sm:px-7 sm:pt-[15px] md:px-10 lg:px-[72px]">
        <ContentWraper>
          <Logo lang={lang} />
        </ContentWraper>
      </div>
      <div className="relative flex h-full w-full justify-evenly min-[1440px]:justify-center min-[1440px]:gap-x-96  max-[768px]:flex-col max-[768px]:justify-center max-[768px]:items-center ">
        {children}
      </div>
    </main>
  );
}
