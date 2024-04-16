'use client';

import Image from 'next/image';
import { Badges } from './badges';
import { InfoSwitcher } from './info-switcher';
import { ContentWraper } from '../../../../../components/content-wraper';
import { TypeEvent } from '@/lib/definitions';
import { chooseTypes } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type TypeEventHeroProps = {
  // fix "any" later
  event: TypeEvent | undefined;
  selectedValue: any;
  onTabSelect: any;
};

export function EventHero({
  event,
  selectedValue,
  onTabSelect,
}: TypeEventHeroProps) {
  return (
    <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
      <Image
        className="opacity-40"
        src={`/ru/images/mock-event-bg/${event?.id.toString()[event?.id.toString().length - 1]}.avif`}
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <ContentWraper className=" relative h-[720px] justify-between">
        <Badges types={chooseTypes(event)} />
        <div className="relative flex flex-col gap-10">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            {event?.name}
          </h1>
          <div className="relative flex gap-6">
            <Button variant="ruchampDefault">Участвовать</Button>
            <Button variant="ruchampTransparent">Купить билеты</Button>
          </div>
          <div className="relative flex items-center justify-center">
            <InfoSwitcher
              selectedValue={selectedValue}
              onTabSelect={onTabSelect}
            />
          </div>
        </div>
      </ContentWraper>
    </section>
  );
}
