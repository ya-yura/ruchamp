import { PaginationBlock } from './pagination-block';
import { CardEvent } from './card-event';
import { useEffect, useState } from 'react';
import { TypeEvent } from '@/lib/definitions';
import { TypeSportsTypes, sportsTypes } from '@/lib/constants';

interface EventsContentProps {
  events: TypeEvent[];
  selectedSportTypes: TypeSportsTypes[];
}

export function EventsCards({
  events,
  selectedSportTypes,
}: EventsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEventsByType, setFilteredEventsByType] = useState<TypeEvent[]>(
    [],
  );

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
    setCurrentPage(1);
  }, [events, selectedSportTypes]);

  const displayedEvents = filteredEventsByType.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  return (
    <>
      {filteredEventsByType.length ? (
        <>
          <ul className="mb-10 grid grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
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
    </>
  );
}
