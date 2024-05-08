import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testData } from '@/lib/constants';
import { divideEventsByDateTime } from '@/lib/utils';

export default async function Events() {
  let events: TypeEvent[];
  try {
    events = await eventsApi.getEvents();
  } catch (err) {
    events = [];
  }

  const { futureEvents, pastEvents } = divideEventsByDateTime([
    ...events,
    ...testData,
  ]);

  // When data will be real, make proper sorting
  futureEvents.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });
  pastEvents.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Container>
      <EventsTabs futureEvents={futureEvents} pastEvents={pastEvents} />
    </Container>
  );
}
