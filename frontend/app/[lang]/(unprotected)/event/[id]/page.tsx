import { AddressSection } from './address-section';
import { Container } from '../../../../../components/container';
import { ExpectedEvents } from './expected-events';
import { EventInfo } from './event-info';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';

export default async function Event({ params }: { params: { id: string } }) {
  const id = params.id;
  let event: TypeEvent | undefined;
  let events: Array<TypeEvent>;
  try {
    event = await eventsApi.getEvent(id);
    events = await eventsApi.getEvents();
  } catch (err) {
    console.log('error', err)
    event = undefined;
    events = [];
  }

  return (
    <Container>
      <EventInfo event={event} />
      <AddressSection event={event} />
      <ExpectedEvents events={events} />
    </Container>
  );
}
