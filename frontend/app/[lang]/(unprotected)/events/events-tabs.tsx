'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ContentWraper } from '../../../../components/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { TypeSportsTypes } from '@/lib/constants';
import { useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { EventsCards } from './events-cards';

interface EventTabsProps {
  futureEvents: TypeEvent[];
  pastEvents: TypeEvent[];
}

export function EventsTabs({ futureEvents, pastEvents }: EventTabsProps) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    Array<TypeSportsTypes>
  >([]);
  return (
    <section className="relative mt-[-92px] flex w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
      <div className="absolute mt-[-92px] h-[853px] w-full ">
        <Image
          className="opacity-40"
          src="/ru/images/background-events.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-[rgba(0,0,0,0.01)] from-50% to-[rgba(0,0,0,1)] to-100%"></div>
      </div>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          defaultValue="futureEvents"
          className="relative mx-auto mb-10 w-full"
        >
          <div className="w-full">
            <TabsList className="mx-auto mb-5 flex w-[500px] justify-between bg-transparent text-[#D6D6D6]">
              <TabsTrigger
                className="rounded-none border-[#115EA3] data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white"
                value="futureEvents"
              >
                Будущие события
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-[#115EA3] data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white"
                value="pastEvents"
              >
                Прошедшие события
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-[#115EA3] data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white"
                value="usersEvents"
              >
                Ваши события
              </TabsTrigger>
            </TabsList>
            <div className="absolute right-0 top-2 flex items-center space-x-2">
              <Switch id="showMap" />
              <Label className="text-sm font-normal" htmlFor="showMap">
                На карте
              </Label>
            </div>
          </div>
          <DatePicker className="mb-4 flex justify-center" />
          <FilterByType setSelected={setSelectedSportTypes} />
          <TabsContent value="futureEvents">
            <EventsCards
              events={futureEvents}
              selectedSportTypes={selectedSportTypes}
            />
          </TabsContent>
          <TabsContent value="pastEvents">
            <EventsCards
              events={pastEvents}
              selectedSportTypes={selectedSportTypes}
            />
          </TabsContent>
          <TabsContent value="usersEvents">
            <p>Ваши события</p>
          </TabsContent>
        </Tabs>
      </ContentWraper>
    </section>
  );
}
