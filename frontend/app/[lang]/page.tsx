import { Locale } from '@/i18n.config';
import { Container } from '@/components/container';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { HomeHero } from '@/components/home-page/home-hero';
import { FeaturesMain } from '@/components/home-page/features-main';
import { FeaturesAdditional } from '@/components/home-page/features-additional';
import { SecondHero } from '@/components/home-page/second-hero';
import { TrustedSection } from '@/components/home-page/trusted-section';
import { getInitials } from '@/lib/utils/text-utils';
import { getSession } from '@/lib/actions/auth';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const session = await getSession();
  let userEmail: string;
  let userAvatar: string | null;
  let initials: string;
  let roleId: number;
  if (!session || !session.user) {
    userEmail = '';
    userAvatar = '';
    initials = '';
    roleId = 0;
  } else {
    const user = session.user;
    const firstName: string = user[1].name;
    const lastName: string = user[1].sirname;
    userEmail = user[1].email;
    userAvatar = user[0].image_field;
    roleId = user[1].role_id;
    initials = getInitials(firstName, lastName);
  }

  return (
    <>
      <Header
        userEmail={userEmail}
        userAvatar={userAvatar}
        initials={initials}
        isLoggedIn={!!session}
        roleId={roleId}
        lang={lang}
      />
      <Container>
        <HomeHero lang={lang} />
        <FeaturesMain lang={lang} />
        <FeaturesAdditional lang={lang} />
        <SecondHero lang={lang} />
        <TrustedSection lang={lang} />
      </Container>
      <Footer lang={lang} />
    </>
  );
}
