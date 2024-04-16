'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ContentWraper } from '../../../../components/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import { useEffect, useMemo, useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { CardEvent } from './card-event';
import { PaginationBlock } from './pagination-block';

export function EventsTabs({ events }: { events: Array<TypeEvent> }) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    Array<TypeSportsTypes>
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(events.length / 12),
  );
  const [pageEvents, setPageEvents] = useState<Array<TypeEvent>>([]);

  useEffect(() => {
    let filtredEvents: TypeEvent[] = [];
    const filter: number[] = selectedSportTypes.map((item) =>
      sportsTypes.indexOf(item),
    );

    if (selectedSportTypes.length !== 0) {
      console.log('123123');
      filtredEvents = events.filter((event) => {
        return filter.some((filter) =>
          event.organizer_id.toString().split('').includes(filter.toString()),
        );
      });
    } else {
      console.log('else');
      filtredEvents = events;
    }

    setTotalPages(Math.ceil(filtredEvents.length / 12));
    setPageEvents(
      filtredEvents.slice((currentPage - 1) * 12, (currentPage - 1) * 12 + 12),
    );
  }, [events, currentPage, selectedSportTypes]);

  // console.log( selectedSportTypes.map(item => sportsTypes.indexOf(item)))

  return (
    <section className="relative mt-[-92px] flex w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
      <div className="absolute mt-[-92px] h-[853px] w-full">
        <Image
          className="opacity-30"
          src="/ru/images/background-events.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          defaultValue="futureEvents"
          className="relative mx-auto mb-10 w-full"
        >
          <div className="w-full">
            <TabsList className="mx-auto mb-5 flex w-[500px] justify-between bg-transparent text-[#D6D6D6]">
              <TabsTrigger value="futureEvents">Будущие события</TabsTrigger>
              <TabsTrigger value="pastEvents">Прошедшие события</TabsTrigger>
              <TabsTrigger value="usersEvents">Ваши события</TabsTrigger>
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
            {pageEvents.length !== 0 ? (
              <>
                <ul className="mb-10 grid grid-cols-3 gap-6">
                  {pageEvents.map((event) => (
                    <CardEvent key={event.id} event={event} />
                  ))}
                </ul>
                <PaginationBlock
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            ) : (
              <p>Ничего не найдено</p>
            )}
          </TabsContent>
          <TabsContent value="pastEvents">
            <p>Прошедшие события</p>
          </TabsContent>
          <TabsContent value="usersEvents">
            <p>Ваши события</p>
          </TabsContent>
        </Tabs>
      </ContentWraper>
    </section>
  );
}
