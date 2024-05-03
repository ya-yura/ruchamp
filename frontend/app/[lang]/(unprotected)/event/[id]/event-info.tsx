'use client';

import { TypeEvent } from '@/lib/definitions';
import Image from 'next/image';
import { ContentWraper } from '@/components/content-wraper';
import { Badges } from './badges';
import { chooseTypes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';

enum EventTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Матчи',
  'grid' = 'Турнирная сетка',
  'results' = 'Результаты',
}

export function EventInfo({ event }: { event: TypeEvent }) {
  const tabs: Record<EventTabs, React.ReactNode> = {
    [EventTabs['info']]: <Info event={event} />,
    [EventTabs['athletes']]: <Athletes />,
    [EventTabs['matches']]: <Matches />,
    [EventTabs['grid']]: <Grid />,
    [EventTabs['results']]: <Results />,
  };

  return (
    <>
      <div className="fixed mt-[-92px] h-[720px] w-full">
        <Image
          className="opacity-40"
          src={`/ru/images/mock-event-bg/${event?.id.toString()[event?.id.toString().length - 1]}.avif`}
          alt="Обложка мероприятия"
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <ContentWraper className="relative h-[590px] justify-between">
        <Badges types={chooseTypes(event)} />
        <div className="relative flex flex-col gap-10">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-background">
            {event?.name}
          </h1>
          <div className="relative flex gap-6 mb-[87px]">
            <Button variant="ruchampDefault">Участвовать</Button>
            <Button variant="ruchampTransparent">Купить билеты</Button>
          </div>
        </div>
      </ContentWraper>
      <section className="bg-primary-background relative mt-[0] flex h-fit w-full flex-col items-center justify-between px-[72px]">
        <ContentWraper className="bg-primary-background relative max-w-7xl justify-between">
          <Tabs
            defaultValue={Object.keys(EventTabs)[0]}
            className="relative mx-auto mb-10 mt-[-38px] w-full"
          >
            <div className="w-full">
              <TabsList className="mx-auto mb-10 flex w-[500px] justify-between bg-transparent text-[#D6D6D6]">
                {Object.entries(EventTabs).map(([key, value]) => (
                  <TabsTrigger
                    key={key}
                    className="rounded-none border-[#115EA3] data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white"
                    value={key}
                  >
                    {value}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {Object.entries(EventTabs).map(([key, value]) => (
              <TabsContent key={key} value={key}>
                {tabs[value as EventTabs]}
              </TabsContent>
            ))}
          </Tabs>
        </ContentWraper>
      </section>
    </>
  );
}
