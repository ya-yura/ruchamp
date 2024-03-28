'use client';

import Image from 'next/image';
import { Badges } from './badges';
import { makeStyles, LargeTitle, Button } from '@fluentui/react-components';
import { InfoSwitcher } from './info-switcher';

const useOverrides = makeStyles({
  title: {
    fontSize: '48px',
    lineHeight: '80px',
    letterSpacing: '-1.2px',
    fontWeight: '700',
  },
});

export function EventHero({
  selectedValue,
  onTabSelect,
}: {
  selectedValue: any;
  onTabSelect: any;
}) {
  const overrides = useOverrides();

  return (
    <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between px-[72px] pt-[92px]">
      <Image
        className="opacity-50"
        src="/ru/images/event-hero-bg.jpeg"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <Badges />
      <div className="relative mt-[262px] self-start">
        <LargeTitle as="h1" className={overrides.title}>
          Кубок Ивана Ярыгина
        </LargeTitle>
      </div>
      <div className="relative flex gap-6 self-start">
        <Button size="large" appearance="primary">
          Участвовать
        </Button>
        <Button size="large" appearance="outline">
          Купить билеты
        </Button>
      </div>
      <div className="relative">
        <InfoSwitcher selectedValue={selectedValue} onTabSelect={onTabSelect} />
      </div>
    </section>
  );
}
