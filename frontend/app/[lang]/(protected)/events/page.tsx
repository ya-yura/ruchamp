import { getSession } from '@/lib/actions';
import { Container } from '../../ui/container';
import { EventsTabs } from './events-tabs';

export default async function Events() {
  const session = await getSession();
  let token;
  if (!session) {
    token = null;
  } else token = session.token;

  return (
    <Container>
      <EventsTabs token={token} />
    </Container>
  );
}
