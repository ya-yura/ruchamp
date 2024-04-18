import { Locale } from '@/i18n.config';
import { Container } from '../../components/container';
import { getSession } from '@/lib/actions';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { HomeHero } from '@/components/home-page/home-hero';
import { FeaturesMain } from '@/components/home-page/features-main';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  // const { page } = await getDictionary(lang);
  const session = await getSession();
  let user;
  if (!session || session.user.length === 0) {
    user === null;
  } else user = session.user;

  return (
    <>
      <Header lang={lang} user={user} />
      <Container>
        <HomeHero lang={lang} />
        <FeaturesMain />
      </Container>
      <Footer lang={lang} />
    </>
  );
}
