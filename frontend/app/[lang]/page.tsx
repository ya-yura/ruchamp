import Image from 'next/image';
import { Text, Display, Title2 } from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { Container } from '../../components/container';
import { ContentWraper } from '../../components/content-wraper';
import { getSession } from '@/lib/actions';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { HomeHero } from '@/components/home-page/home-hero';

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
        <HomeHero />
        <section className="w-full px-[72px] py-8">
          <ContentWraper>
            <div className="flex w-full flex-col gap-5">
              <Title2 as="h2">Это заголовок секции</Title2>
              <Text as="p">
                Прежде всего, экономическая повестка сегодняшнего дня создаёт
                необходимость включения в производственный план целого ряда
                внеочередных мероприятий с учётом комплекса дальнейших
                направлений развития. Равным образом, сложившаяся структура
                организации играет важную роль в формировании первоочередных
                требований. Банальные, но неопровержимые выводы, а также явные
                признаки победы институционализации формируют глобальную
                экономическую сеть и при этом — ассоциативно распределены по
                отраслям.
              </Text>
              <Text as="p">
                Идейные соображения высшего порядка, а также экономическая
                повестка сегодняшнего дня влечет за собой процесс внедрения и
                модернизации прогресса профессионального сообщества. В целом,
                конечно, сплочённость команды профессионалов не оставляет шанса
                для первоочередных требований. Принимая во внимание показатели
                успешности, разбавленное изрядной долей эмпатии, рациональное
                мышление способствует повышению качества стандартных подходов.
              </Text>
            </div>
          </ContentWraper>
        </section>
      </Container>
      <Footer lang={lang} />
    </>
  );
}
