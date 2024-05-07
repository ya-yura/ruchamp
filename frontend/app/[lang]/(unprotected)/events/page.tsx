import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testFutureData } from '@/lib/constants';
import { divideEventsByDateTime } from '@/lib/utils';

export default async function Events() {
  let events: TypeEvent[];
  try {
    events = await eventsApi.getEvents();
    events.sort((a, b) => {
      const dateA = new Date(a.start_datetime);
      const dateB = new Date(b.start_datetime);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (err) {
    events = [];
  }

  testFutureData.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });

  const { futureEvents, pastEvents } = divideEventsByDateTime([
    ...events,
    ...testFutureData,
  ]);

  return (
    <Container>
      <EventsTabs futureEvents={futureEvents} pastEvents={pastEvents} />
    </Container>
  );
}
