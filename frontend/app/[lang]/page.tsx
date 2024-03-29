import Image from 'next/image';
import { Text, Display, Title2 } from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { Container } from './ui/container';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);

  return (
    <Container>
      <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
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
      </section>
      <section className="w-full px-[72px] py-8">
        <div className="flex w-full flex-col gap-5">
          <Title2 as="h2">{page.home.sectionOne.title}</Title2>
          <Text as="p">{page.home.sectionOne.paragraphOne}</Text>
          <Text as="p">{page.home.sectionOne.paragraphTwo}</Text>
        </div>
      </section>
    </Container>
  );
}
