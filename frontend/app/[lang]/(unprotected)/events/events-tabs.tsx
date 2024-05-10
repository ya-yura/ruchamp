'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentWraper } from '../../../../components/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { SportsTypes, sportsTypes } from '@/lib/constants';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Event } from '@/lib/definitions';
import { EventsCards } from './events-cards';
import { DateRange } from 'react-day-picker';
import { CustomSection } from '@/components/custom-section';
import { cn } from '@/lib/utils';

interface ModeSwitherProps {
  isOnMode: boolean;
  setIsOnMode: Dispatch<SetStateAction<boolean>>;
  className?: string;
}
interface EventTabsProps {
  futureEvents: Event[];
  pastEvents: Event[];
}

enum EventTabs {
  'futureEvents' = 'Будущие события',
  'pastEvents' = 'Прошедшие события',
  'usersEvents' = 'Ваши события',
}

export function EventsTabs({ futureEvents, pastEvents }: EventTabsProps) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<SportsTypes[]>(
    [],
  );
  const [date, setDate] = useState<DateRange | undefined>(
    undefined,
    // {from: new Date(),
    // to: addDays(new Date(), 20),}
  );
  const [isMapMode, setIsMapMode] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <CustomSection ref={topRef}>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          defaultValue="futureEvents"
          className="relative mx-auto mb-10 w-full"
        >
          <div className="flex h-[164px] w-full sm:h-[64px]">
            <TabsList className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-[500px]">
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
            <ModeSwither
              isOnMode={isMapMode}
              setIsOnMode={setIsMapMode}
              className="hidden lg:flex"
            />
          </div>
          <DatePicker
            className="mb-4 flex justify-center"
            date={date}
            setDate={setDate}
          />
          <FilterByType
            options={sportsTypes}
            selected={selectedSportTypes}
            setSelected={setSelectedSportTypes}
            isOnMode={isMapMode}
            setIsOnMode={setIsMapMode}
          />
          <TabsContent value="futureEvents">
            <EventsCards
              events={futureEvents}
              selectedSportTypes={selectedSportTypes}
              date={date}
              scrollToTop={scrollToTop}
              isMapMode={isMapMode}
            />
          </TabsContent>
          <TabsContent value="pastEvents">
            <EventsCards
              events={pastEvents}
              selectedSportTypes={selectedSportTypes}
              date={date}
              scrollToTop={scrollToTop}
              isMapMode={isMapMode}
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

export function ModeSwither({
  className,
  isOnMode,
  setIsOnMode,
}: ModeSwitherProps) {
  return (
    <div
      className={cn(
        `absolute right-0 flex items-center space-x-2 py-2`,
        className,
      )}
    >
      <Switch
        checked={isOnMode}
        onCheckedChange={() => setIsOnMode(!isOnMode)}
        id="showMap"
      />
      <Label className="text-sm font-normal text-background" htmlFor="showMap">
        На карте
      </Label>
    </div>
  );
}
