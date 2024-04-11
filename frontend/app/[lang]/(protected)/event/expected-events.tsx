'use client';

import { Title1 } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import CustomCard from '../../ui/custom-card';
import { ContentWraper } from '../../ui/content-wraper';

const useOverrides = makeStyles({
  title: { color: tokens.colorNeutralForeground4, fontWeight: '700' },
});

const cardMockData = [
  {
    title: 'Турнир турниров',
    date: '24 мая, Москва',
  },
  {
    title: 'Братуха-борцуха',
    date: '30 июня, Владивосток',
  },
  {
    title: 'Чемпионат Москвы и области и ещё текст',
    date: '7 января, Афипский',
  },
  {
    title: 'Плавали - знаем!',
    date: '1 января, Братск',
  },
];

export function ExpectedEvents() {
  const overrides = useOverrides();

  return (
    <section className="flex w-full flex-col px-[72px] pb-7 pt-12">
      <ContentWraper className='gap-6'>
        <Title1 className={overrides.title}>Самые ожидаемые события</Title1>
        <div className="grid grid-cols-4 gap-[18px]">
          {cardMockData.map((item) => (
            <CustomCard key={item.title} title={item.title} date={item.date} />
          ))}
        </div>
      </ContentWraper>
    </section>
  );
}
