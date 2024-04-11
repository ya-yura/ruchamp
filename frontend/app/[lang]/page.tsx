import Image from 'next/image';
import { Text, Display, Title2 } from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { Container } from './ui/container';
import { Header } from './ui/header/header';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';
import { ContentWraper } from './ui/content-wraper';
import { signOut } from 'next-auth/react';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const session = await getServerSession(authOptions);

  let token = null;
  let user = null;
  if (session) {
    token = session?.user?.name as string;
    try {
      const res = await auth.getCurrentUser(token);
      user = res;
    } catch (err) {
      user = null;
      console.log('getCurrentUser error: ', err);
    }
  }

  return (
    <>
      <Header lang={lang} user={user} />
      <Container>
        <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
          <ContentWraper>
            <Image
              className="opacity-50"
              src="/fighter-and-ring.avif"
              alt={page.home.hero.imageAlt}
              fill={true}
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute top-0 flex h-full w-full flex-col justify-center px-[72px]">
              <div className="flex w-2/5 flex-col">
                <Display as="h1">{page.home.hero.title}</Display>
                <Text as="p" size={600} weight="semibold">
                  {page.home.hero.description}
                </Text>
              </div>
            </div>
          </ContentWraper>
        </section>
        <section className="w-full px-[72px] py-8">
          <ContentWraper>
            <div className="flex w-full flex-col gap-5">
              <Title2 as="h2">{page.home.sectionOne.title}</Title2>
              <Text as="p">{page.home.sectionOne.paragraphOne}</Text>
              <Text as="p">{page.home.sectionOne.paragraphTwo}</Text>
            </div>
          </ContentWraper>
        </section>
      </Container>
    </>
  );
}
