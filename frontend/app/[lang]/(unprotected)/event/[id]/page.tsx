import { AddressSection } from './address-section';
import { Container } from '../../../../../components/container';
import { ExpectedEvents } from './expected-events';
import { EventInfo } from './event-info';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';
import { getRandomInt } from '@/lib/utils';

export default async function Event({ params }: { params: { id: string } }) {
  const id = params.id;
  let events: Array<TypeEvent>;
  let expectedEvents: Array<TypeEvent>;
  const event: TypeEvent = await eventsApi.getEvent(id);
  const randomInt = getRandomInt(100);
  try {
    events = await eventsApi.getEvents();
  } catch (err) {
    console.log('error', err);
    events = [];
  }

  if (events.length > 3) {
    expectedEvents = events.slice(randomInt, randomInt + 16);
  } else if (events.length > 0 && events.length < 4) {
    expectedEvents = events.slice(0, events.length);
  } else {
    expectedEvents = [];
  }

  if (!event) {
    return <div>Такого события не существует</div>;
  }

  return (
    <Container>
      <EventInfo event={event} />
      <AddressSection event={event} />
      <ExpectedEvents events={expectedEvents} />
    </Container>
  );
}
