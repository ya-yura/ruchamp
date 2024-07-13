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
    <main className="absolute left-0 top-0 h-[100vh] w-full bg-primary-background overflow-y-scroll">
      <Image
        className="relative opacity-50"
        src="/ru/images/background-auth.jpeg"
        alt=""
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute z-10 w-full px-4 pt-[10px] sm:px-7 sm:pt-[15px] md:px-10 lg:px-[72px]">
        <ContentWraper>
          <Logo lang={lang} />
        </ContentWraper>
      </div>
      <div className="relative flex w-full justify-between px-12 xl:px-36 flex-col lg:flex-row items-center sm:px-10 mt-24 lg:mt-52">
        {children}
      </div>
    </main>
  );
}
