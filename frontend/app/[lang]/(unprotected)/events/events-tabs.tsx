'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentWraper } from '@/components/content-wraper';
import { DatePicker } from './date-picker';
import { FilterByType } from './filter-by-type';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Event } from '@/lib/definitions';
import { BigCardsWithImageField } from '@/components/cards/big-cards-with-image-field';
import { DateRange } from 'react-day-picker';
import { CustomSection } from '@/components/custom-section';
import { Dictionary } from '../../dictionary-provider';
import { YandexMap } from '@/components/yandex-map';
import { Locale } from '@/i18n.config';
import { ModeSwither } from '@/components/mode-switcher';
import { isDateInRange, transformDate } from '@/lib/utils/date-and-time';
import { Button } from '@/components/ui/button';
import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import { usePathname } from 'next/navigation';
import { CreateEventDialog } from '@/components/dialogs/create-event';

interface EventTabsProps {
  dictionary: Dictionary['page']['events'];
  lang: Locale;
  sportTypes: string[];
  futureEvents: Event[];
  pastEvents: Event[];
  isOrg?: boolean;
  token?: string;
  errorText?: string;
}

enum EventTabs {
  FUTURE_EVENTS = 'futureEvents',
  PAST_EVENTS = 'pastEvents',
}

export function EventsTabs({
  dictionary,
  lang,
  sportTypes,
  futureEvents,
  pastEvents,
  isOrg,
  token,
  errorText,
}: EventTabsProps) {
  const [tabValue, setTabValue] = useState<EventTabs>(EventTabs.FUTURE_EVENTS);
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isMapMode, setIsMapMode] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0); // This state is to reload map with new data
  const topRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isFirstCardBig =
    isOrg &&
    tabValue === EventTabs['FUTURE_EVENTS'] &&
    pathname.includes('org');

  // For dictionary
  const labels = {
    [EventTabs.FUTURE_EVENTS]: dictionary.filters.futureEvents,
    [EventTabs.PAST_EVENTS]: dictionary.filters.pastEvents,
  };

  // Filtering logic
  const filteredEvents = useMemo(() => {
    let events: Event[];
    switch (tabValue) {
      case EventTabs.FUTURE_EVENTS:
        events = futureEvents;
        break;
      case EventTabs.PAST_EVENTS:
        events = pastEvents;
        break;
      default:
        events = futureEvents;
    }
    const filtredByDateEvents = date
      ? events.filter((event) => isDateInRange(event.start_datetime, date))
      : events;
    setMapKey((prevKey) => prevKey + 1); // This state is to reload map with new data
    return selectedSportTypes.length
      ? filtredByDateEvents.filter((event) =>
          event.sports_in_matches.some((item) =>
            selectedSportTypes.includes(item),
          ),
        )
      : filtredByDateEvents;
  }, [tabValue, selectedSportTypes, date]);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value as EventTabs);
  }, []);

  return (
    <CustomSection ref={topRef}>
      <ContentWraper className="h-fit justify-between">
        <Tabs
          className="relative mx-auto mb-10 w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="flex h-[164px] w-full sm:h-[64px]">
            <TabsList className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(EventTabs).map(([key, value]) => (
                <TabsTrigger key={value} value={value}>
                  {labels[value]}
                </TabsTrigger>
              ))}
            </TabsList>
            <ModeSwither
              isOnMode={isMapMode}
              setIsOnMode={setIsMapMode}
              label="На карте"
              id="showMap"
              className="hidden lg:flex"
            />
          </div>
          <div className="relative flex justify-center">
            <DatePicker
              className="mb-4 flex justify-center"
              date={date}
              setDate={setDate}
            />
            {isOrg && (
              <CreateEventDialog
                className="absolute right-0 top-0"
                token={token}
                lang={lang}
              />
            )}
          </div>
          <FilterByType
            options={sportTypes}
            selected={selectedSportTypes}
            setSelected={setSelectedSportTypes}
          >
            <ModeSwither
              isOnMode={isMapMode}
              setIsOnMode={setIsMapMode}
              label="На карте"
              id="showMap"
              className="relative ml-auto lg:hidden"
            />
          </FilterByType>

          {Object.entries(EventTabs).map(([key, value]) => (
            <TabsContent key={value} value={value}>
              {filteredEvents.length === 0 && (
                <p className="mb-5 text-base text-background">
                  {errorText ? errorText : 'Ничего не найдено'}
                </p>
              )}
              {isMapMode ? (
                <YandexMap
                  key={mapKey} // This key is to reload map with new data
                  mapId="eventsMap"
                  places={filteredEvents}
                  size={{ width: '100%', height: '50vh' }}
                />
              ) : (
                <>
                  {isFirstCardBig && !!filteredEvents.length && (
                    <ul className="mb-10">
                      <BigCardWithImage
                        key={filteredEvents[0]?.id}
                        type={'event'}
                        id={filteredEvents[0]?.id}
                        name={filteredEvents[0]?.name}
                        tags={filteredEvents[0]?.sports_in_matches.join(', ')}
                        title={transformDate(filteredEvents[0]?.start_datetime)}
                        subtitle={filteredEvents[0]?.location}
                        description={filteredEvents[0]?.description}
                        image={filteredEvents[0]?.image_field}
                        lang={lang}
                      />
                    </ul>
                  )}
                  <BigCardsWithImageField
                    cards={
                      isFirstCardBig ? filteredEvents.slice(1) : filteredEvents
                    }
                    type="event"
                    scrollToTop={scrollToTop}
                    lang={lang}
                  />
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ContentWraper>
    </CustomSection>
  );
}
