import { CardEvent } from './card-event';
import { useEffect, useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventsContentProps {
  events: TypeEvent[];
  selectedSportTypes: TypeSportsTypes[];
  scrollToTop: () => void;
}

export function EventsCards({
  events,
  selectedSportTypes,
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
    const filter = selectedSportTypes.map((item) => sportsTypes.indexOf(item));
    const filteredEvents = selectedSportTypes.length
      ? events.filter((event) =>
          filter.some((f) =>
            event.organizer_id.toString().split('').includes(f.toString()),
          ),
        )
      : events;

    setFilteredEventsByType(filteredEvents);
    setDisplayedEvents(filteredEvents.slice(0, eventsPerPage));
    setCurrentPage(1);
  }, [events, selectedSportTypes]);

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
          <ul className="mb-10 grid grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <CardEvent key={event.id} event={event} />
            ))}
          </ul>
          {/* <PaginationBlock
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
        </>
      ) : (
        <p>Ничего не найдено</p>
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
