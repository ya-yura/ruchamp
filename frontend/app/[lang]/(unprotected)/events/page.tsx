import { EventsTabs } from './events-tabs';
import { Event } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testData } from '@/lib/constants';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { divideEventsByDateTime } from '@/lib/utils/date-and-time';
import { sortedEventsByDate } from '@/lib/utils/filters';
import { fetchEvents, fetchSportTypes } from '@/lib/data';
import { Suspense } from 'react';
import Loading from './loading';

export default async function Events({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const [events, sportTypes] = await Promise.all([
    fetchEvents(),
    fetchSportTypes(),
  ]);
  const usersEvents: Event[] = []; // make this logic later
  const dictionary = page.events;

  const { futureEvents, pastEvents } = divideEventsByDateTime(events);
  const sortedFutureEvents = sortedEventsByDate(futureEvents);
  const sortedPastEvents = sortedEventsByDate(pastEvents);

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <EventsTabs
          dictionary={dictionary}
          lang={lang}
          sportTypes={sportTypes}
          futureEvents={sortedFutureEvents}
          pastEvents={sortedPastEvents}
          usersEvents={usersEvents}
        />
      </Suspense>
    </Container>
  );
}
