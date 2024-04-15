import { getSession } from '@/lib/actions';
import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';
import { Container } from '../../ui/container';

export default async function Events() {
  const session = await getSession();
  let events: Array<TypeEvent>;
  try {
    events = await eventsApi.getEvents();
  } catch (err) {
    events = [];
  }

  return (
    <Container>
      <EventsTabs events={events} />
    </Container>
  );
}
