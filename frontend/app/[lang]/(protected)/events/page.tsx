import { getSession } from '@/lib/actions';
import { Container } from '../../ui/container';
import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { PaginationBlock } from './pagination-block';

export default async function Events() {
  const session = await getSession();
  let token;
  let events;
  if (!session) {
    token = null;
    events = [];
  }
  token = session.token;
  events = await eventsApi.getEvents(token);

  return (
    <Container>
      <EventsTabs events={events} />
    </Container>
  );
}
