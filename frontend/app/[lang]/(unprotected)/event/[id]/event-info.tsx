'use client';

import Image from 'next/image';
import { TypeEvent } from '@/lib/definitions';
import { useRef } from 'react';
import { Badges } from './badges';
import { chooseTypes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { useScrollY } from '@/lib/hooks/useScrollY';
import { CustomSection } from '@/components/custom-section';
import { cn } from '@/lib/utils';
import { H1 } from '@/components/text';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

enum EventTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Матчи',
  'grid' = 'Турнирная сетка',
  'results' = 'Результаты',
}

export function EventInfo({ event }: { event: TypeEvent }) {
  const refContainer = useRef<HTMLDivElement>(null);
  const [scrollY] = useScrollY();

  let progress = 0;

  const { current: elContainer } = refContainer;
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  const tabs: Record<EventTabs, React.ReactNode> = {
    [EventTabs['info']]: <Info event={event} />,
    [EventTabs['athletes']]: <Athletes />,
    [EventTabs['matches']]: <Matches />,
    [EventTabs['grid']]: <Grid />,
    [EventTabs['results']]: <Results />,
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          `absolute mt-[-92px] flex h-[720px] w-full items-end overflow-hidden`,
        )}
        ref={refContainer}
      >
        <Image
          className="opacity-40"
          src={`/ru/images/mock-event-bg/${event?.id.toString()[event?.id.toString().length - 1]}.avif`}
          alt="Обложка мероприятия"
          fill={true}
          style={{
            objectFit: 'cover',
            transform: `translateY(${8 - progress * 15}vh)`,
            backgroundPosition: 'top',
            scale: '130%',
          }}
        />
      </div>
      <CustomSection className="relative h-[590px] items-start justify-between bg-transparent">
        <Badges types={chooseTypes(event)} />
        <div className="relative flex flex-col gap-10">
          <H1>{event?.name}</H1>
          <div className="mb-[87px] flex gap-6">
            <Button variant="ruchampDefault">Участвовать</Button>
            <Button variant="ruchampTransparent">Купить билеты</Button>
          </div>
        </div>
      </CustomSection>
      <CustomSection className="h-fit">
        <Tabs
          defaultValue={Object.keys(EventTabs)[0]}
          className="mb-10 mt-[-38px] w-full"
        >
          <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
            <TabsList className="text-text-mutedLight mb-10 flex w-fit justify-between bg-transparent sm:mx-auto">
              {Object.entries(EventTabs).map(([key, value]) => (
                <TabsTrigger
                  key={key}
                  className={cn(
                    'rounded-none border-[#115EA3]',
                    'data-[state=active]:border-b-4 data-[state=active]:bg-transparent',
                    'data-[state=active]:font-bold data-[state=active]:text-white',
                    'first-of-type:ml-4 last-of-type:mr-4',
                    'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                  )}
                  value={key}
                >
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
          {Object.entries(EventTabs).map(([key, value]) => (
            <TabsContent key={key} value={key}>
              {tabs[value as EventTabs]}
            </TabsContent>
          ))}
        </Tabs>
      </CustomSection>
    </div>
  );
}
