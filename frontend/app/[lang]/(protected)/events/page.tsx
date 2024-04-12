import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

import { Container } from '../../ui/container';
import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';

export default async function Events() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;

  const serverEvents: Array<TypeEvent> = await eventsApi.getEvents(token)

  return (
    <Container>
      <EventsTabs token={token} serverEvents={serverEvents}/>
    </Container>
  );
}
