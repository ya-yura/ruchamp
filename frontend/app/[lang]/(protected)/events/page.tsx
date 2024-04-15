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

  const mockEvent = {
    name: 'Art Exhibition: Reflections',
    start_datetime: '2024-05-10T10:00:00',
    location: 'Art Gallery, 123 Main St, Cityville',
    event_order:
      'A showcase of contemporary art exploring themes of introspection and self-discovery.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-05-30T18:00:00',
    id: 5,
    organizer_id: 2103,
    event_system: 'exhibition',
    image_field: 'https://placeimg.com/640/480/art',
  };

  const mockEvents = [...events, mockEvent];

  return (
    <Container>
      <EventsTabs events={mockEvents} />
    </Container>
  );
}
