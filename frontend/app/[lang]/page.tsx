import Image from 'next/image';
import { Text, Display, Title2 } from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);

  return (
    <main className="min-h-screen">
      <section className="w-full h-[800px] relative">
        <Image
          className=""
          src="/fighter-and-ring.avif"
          alt={page.home.hero.imageAlt}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute top-0 px-9 bg-black/20 w-full h-full flex flex-col justify-center">
          <div className="w-2/5 flex flex-col">
            <Display as="h1" id="123">
              {page.home.hero.title}
            </Display>
            <Text as="p" size={600} weight="semibold">
              {page.home.hero.description}
            </Text>
          </div>
        </div>
      </section>
      <section className="w-full bg-black px-7 py-8">
        <div className="w-full flex flex-col gap-5">
          <Title2 as="h2">{page.home.sectionOne.title}</Title2>
          <Text as="p">{page.home.sectionOne.paragraphOne}</Text>
          <Text as="p">{page.home.sectionOne.paragraphTwo}</Text>
        </div>
      </section>
    </main>
  );
}
