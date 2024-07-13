import { Locale } from '@/i18n.config';
import { Container } from '@/components/container';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { HomeHero } from '@/components/home-page/home-hero';
import { FeaturesMain } from '@/components/home-page/features-main';
import { FeaturesAdditional } from '@/components/home-page/features-additional';
import { SecondHero } from '@/components/home-page/second-hero';
import { TrustedSection } from '@/components/home-page/trusted-section';
import { SupportedSection } from '@/components/home-page/supported-section';
import { getInitials } from '@/lib/utils/text-utils';
import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { auth } from '@/lib/api/auth';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const session = await getSession();
  const token = session?.token;
  const profile = await auth.getCurrentUser(token);

  const user: UserInfo | null = session
    ? {
        basicInfo: profile[1],
        roleInfo: profile[0],
      }
    : null;

  const initials = getInitials(user?.basicInfo.name, user?.basicInfo.sirname);

  return (
    <>
      <Header
        userEmail={user?.basicInfo.email}
        userAvatar={user?.roleInfo.image_field}
        initials={initials}
        isLoggedIn={!!session}
        roleId={user?.basicInfo.role_id}
        lang={lang}
      />
      <Container>
        <HomeHero lang={lang} />
        <FeaturesMain lang={lang} />
        <FeaturesAdditional lang={lang} />
        <SecondHero lang={lang} />
        <TrustedSection lang={lang} />
        <SupportedSection lang={lang} />
      </Container>
      <Footer lang={lang} />
    </>
  );
}
