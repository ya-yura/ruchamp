'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentWraper } from '@/components/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { SportsTypes, sportsTypes } from '@/lib/constants';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Event } from '@/lib/definitions';
import { BigCardsWithImageField } from '../../../../components/cards/big-cards-with-image-field';
import { DateRange } from 'react-day-picker';
import { CustomSection } from '@/components/custom-section';
import { cn, isDateInRange } from '@/lib/utils';
import { Dictionary } from '../../dictionary-provider';
import { YandexMap } from '@/components/yandex-map';
import { Locale } from '@/i18n.config';

interface ModeSwitherProps {
  isOnMode: boolean;
  setIsOnMode: Dispatch<SetStateAction<boolean>>;
  className?: string;
}
interface EventTabsProps {
  dictionary: Dictionary['page']['events'];
  lang: Locale;
  futureEvents: Event[];
  pastEvents: Event[];
  usersEvents: Event[];
}

enum EventTabs {
  FUTURE_EVENTS = 'futureEvents',
  PAST_EVENTS = 'pastEvents',
  USERS_EVENTS = 'usersEvents',
}

export function EventsTabs({
  dictionary,
  lang,
  futureEvents,
  pastEvents,
  usersEvents,
}: EventTabsProps) {
  const [tabValue, setTabValue] = useState<EventTabs>(EventTabs.FUTURE_EVENTS);
  const [selectedSportTypes, setSelectedSportTypes] = useState<SportsTypes[]>(
    [],
  );
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isMapMode, setIsMapMode] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0); // This state is to reload map with new data
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let events: Event[];
    switch (tabValue) {
      case EventTabs.FUTURE_EVENTS:
        events = futureEvents;
        break;
      case EventTabs.PAST_EVENTS:
        events = pastEvents;
        break;
      case EventTabs.USERS_EVENTS:
        events = usersEvents;
        break;
      default:
        events = futureEvents;
    }
    const filtredByDateEvents = date
      ? events.filter((event) => isDateInRange(event.start_datetime, date))
      : events;

    // Filter by type is in temporary variant
    const filterByType = selectedSportTypes.map((item) =>
      sportsTypes.indexOf(item),
    );
    const filteredEvents = selectedSportTypes.length
      ? filtredByDateEvents.filter((event) =>
          filterByType.some((f) =>
            event.id.toString().split('').includes(f.toString()),
          ),
        )
      : filtredByDateEvents;

    setFilteredEvents(filteredEvents);
    setMapKey((prevKey) => prevKey + 1); // This state is to reload map with new data
  }, [tabValue, selectedSportTypes, date]);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value as EventTabs);
  }, []);

  const labels = {
    [EventTabs.FUTURE_EVENTS]: dictionary.filters.futureEvents,
    [EventTabs.PAST_EVENTS]: dictionary.filters.pastEvents,
    [EventTabs.USERS_EVENTS]: dictionary.filters.usersEvents,
  };

  return (
    <CustomSection ref={topRef}>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          className="relative mx-auto mb-10 w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="flex h-[164px] w-full sm:h-[64px]">
            <TabsList className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-[500px]">
              {Object.entries(EventTabs).map(([key, value]) => (
                <TabsTrigger
                  key={value}
                  className="rounded-none border-[#115EA3] text-base data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white sm:text-sm"
                  value={value}
                >
                  {labels[value]}
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

          {Object.entries(EventTabs).map(([key, value]) => (
            <TabsContent key={value} value={value}>
              <p className="mb-5 text-base text-background">
                {filteredEvents.length > 1
                  ? `Найдено: ${filteredEvents.length}`
                  : 'Ничего не найдено'}
              </p>
              {isMapMode ? (
                <YandexMap
                  key={mapKey} // This key is to reload map with new data
                  places={filteredEvents}
                  size={{ width: '100%', height: '50vh' }}
                />
              ) : (
                <BigCardsWithImageField
                  cards={filteredEvents}
                  type="event"
                  scrollToTop={scrollToTop}
                  lang={lang}
                />
              )}
            </TabsContent>
          ))}
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
