import { CardEvent } from './card-event';
import { useEffect, useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn, isDateInRange } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface EventsContentProps {
  events: TypeEvent[];
  selectedSportTypes: TypeSportsTypes[];
  date: DateRange | undefined;
  scrollToTop: () => void;
}

export function EventsCards({
  events,
  selectedSportTypes,
  date,
  scrollToTop,
}: EventsContentProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredEventsByType, setFilteredEventsByType] = useState<TypeEvent[]>(
    [],
  );
  const [displayedEvents, setDisplayedEvents] = useState<TypeEvent[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpButtonShown, setIsUpButtonShown] = useState<boolean>(false);

  const eventsPerPage = 12;
  const totalPages = Math.ceil(filteredEventsByType.length / eventsPerPage);

  useEffect(() => {
    const filtredByDateEvents = date
      ? events.filter((event) => isDateInRange(event.start_datetime, date))
      : events;
    // Filter by type is in temporary state
    const filterByType = selectedSportTypes.map((item) =>
      sportsTypes.indexOf(item),
    );
    const filteredEvents = selectedSportTypes.length
      ? filtredByDateEvents.filter((event) =>
          filterByType.some((f) =>
            event.organizer_id.toString().split('').includes(f.toString()),
          ),
        )
      : filtredByDateEvents;

    setFilteredEventsByType(filteredEvents);
    setDisplayedEvents(filteredEvents.slice(0, eventsPerPage));
    setCurrentPage(1);
  }, [events, selectedSportTypes, date]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (isFetching) {
      setCurrentPage((prevVal) => prevVal + 1);
      setDisplayedEvents(
        filteredEventsByType.slice(0, (currentPage + 1) * eventsPerPage),
      );
    }
    setIsFetching(false);
  }, [isFetching]);

  function scrollHandler() {
    const scrollHeight = document.documentElement.scrollHeight; // height of an element's content, including content not visible on the screen due to overflow.
    const scrollTop = document.documentElement.scrollTop; //gets or sets the number of pixels that an element's content is scrolled vertically.
    const innerHeight = window.innerHeight; //interior height of the window in pixels, including the height of the horizontal scroll bar

    if (scrollTop > 1000) {
      setIsUpButtonShown(true);
    } else {
      setIsUpButtonShown(false);
    }

    if (
      scrollHeight - (scrollTop + innerHeight) < 500 &&
      currentPage < totalPages
    ) {
      setIsFetching(true);
    }
  }

  return (
    <>
      {filteredEventsByType.length ? (
        <>
          <p className="mb-5 text-base text-background">
            Найдено событий: <b>{filteredEventsByType.length}</b>
          </p>
          <ul className="mb-10 grid grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <CardEvent key={event.id} event={event} />
            ))}
          </ul>
        </>
      ) : (
        <p className="text-base text-background">Ничего не найдено</p>
      )}
      <Button
        variant="ruchampTransparentGreyBorder"
        size="lg"
        className={cn(
          'fixed right-20 top-20 h-12 w-12 rounded-full p-0 text-border transition-all duration-700 hover:text-black',
          isUpButtonShown ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        onClick={scrollToTop}
      >
        <ArrowUp className="h-6 w-6" />
        <span className="sr-only">Наверх</span>
      </Button>
    </>
  );
}
