import '@/app/[lang]/ui/global.css';
import { Locale, i18n } from '@/i18n.config';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { getSession } from '@/lib/actions';
import Image from 'next/image';

export default async function UnprotectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  let user;
  if (!session || session.user.length === 0) {
    user === null;
  } else user = session.user;

  return (
    <>
      <Header lang={params.lang} user={user} />
      <div className="absolute mt-[-92px] h-[853px] w-full ">
        <Image
          className="opacity-40"
          src="/ru/images/background-events.jpeg"
          alt=""
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="to-primary-background absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-[rgba(0,0,0,0.01)] from-50% to-100%"></div>
      </div>
      {children}
      <Footer lang={params.lang} />
    </>
  );
}
