import Image from 'next/image';
import { Text, Display, Title2 } from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { Container } from '../../components/container';
import { ContentWraper } from '../../components/content-wraper';
import { getSession } from '@/lib/actions';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

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
        <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
          <ContentWraper>
            <Image
              className="opacity-50"
              src="/ru/images/fighter-and-ring.avif"
              alt="Боец выходит на ринг"
              fill={true}
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute top-0 flex h-full w-full flex-col justify-center px-[72px]">
              <div className="flex w-2/5 flex-col">
                <Display as="h1">РуЧамп</Display>
                <Text as="p" size={600} weight="semibold">
                  Онлайн-платформа для организации, регистрации и участия в
                  соревнованиях и мероприятиях в сфере боевых искусств.
                </Text>
              </div>
            </div>
          </ContentWraper>
        </section>
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
