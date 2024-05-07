'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ContentWraper } from '../../../../components/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { TypeSportsTypes } from '@/lib/constants';
import { useRef, useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { EventsCards } from './events-cards';
import { DateRange } from 'react-day-picker';
import { CustomSection } from '@/components/custom-section';
import { cn } from '@/lib/utils';

interface EventTabsProps {
  futureEvents: TypeEvent[];
  pastEvents: TypeEvent[];
}

enum EventTabs {
  'futureEvents' = 'Будущие события',
  'pastEvents' = 'Прошедшие события',
  'usersEvents' = 'Ваши события',
}

export function EventsTabs({ futureEvents, pastEvents }: EventTabsProps) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    TypeSportsTypes[]
  >([]);
  const [date, setDate] = useState<DateRange | undefined>(
    undefined,
    // {from: new Date(),
    // to: addDays(new Date(), 20),}
  );
  const topRef = useRef<HTMLDivElement | null>(null);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <CustomSection ref={topRef} className="mt-[-92px] pt-[92px]">
      <div className="absolute mt-[-92px] h-[853px] w-full ">
        <Image
          className="opacity-40"
          src="/ru/images/background-events.jpeg"
          alt=""
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="to-primary-background absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-[rgba(0,0,0,0.01)] from-50% to-100%"></div>
      </div>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          defaultValue="futureEvents"
          className="relative mx-auto mb-10 w-full"
        >
          <div className="items relative flex w-full">
            <TabsList className="items mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-[500px]">
              {Object.entries(EventTabs).map(([key, value]) => (
                <TabsTrigger
                  key={key}
                  className="rounded-none border-[#115EA3] text-base data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white sm:text-sm"
                  value={key}
                >
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
            <ModeSwither className="hidden lg:flex" />
          </div>
          <DatePicker
            className="mb-4 flex justify-center"
            date={date}
            setDate={setDate}
          />
          <FilterByType
            selectedSportTypes={selectedSportTypes}
            setSelected={setSelectedSportTypes}
          />
          <TabsContent value="futureEvents">
            <EventsCards
              events={futureEvents}
              selectedSportTypes={selectedSportTypes}
              date={date}
              scrollToTop={scrollToTop}
            />
          </TabsContent>
          <TabsContent value="pastEvents">
            <EventsCards
              events={pastEvents}
              selectedSportTypes={selectedSportTypes}
              date={date}
              scrollToTop={scrollToTop}
            />
          </TabsContent>
          <TabsContent value="usersEvents">
            <p className="text-background">Ваши события</p>
          </TabsContent>
        </Tabs>
      </ContentWraper>
    </CustomSection>
  );
}

export function ModeSwither({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `absolute right-0 flex items-center space-x-2 py-2`,
        className,
      )}
    >
      <Switch id="showMap" />
      <Label className="text-sm font-normal text-background" htmlFor="showMap">
        На карте
      </Label>
    </div>
  );
}
