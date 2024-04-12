import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

import { Container } from '../../ui/container';
import { EventsTabs } from './events-tabs';

export default async function Events() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;

  return (
    <Container>
      <EventsTabs token={token}/>
    </Container>
  );
}
