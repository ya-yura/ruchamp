import { EventsTabs } from './events-tabs';
import { Event } from '@/lib/definitions';
import { Container } from '@/components/container';
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
  const dictionary = page.events;

  if (events === null) {
    return (
      <Container>
        <Suspense fallback={<Loading />}>
          <EventsTabs
            dictionary={dictionary}
            lang={lang}
            sportTypes={sportTypes}
            futureEvents={[]}
            pastEvents={[]}
            errorText={'Произошла ошибка при загрузке событий'}
          />
        </Suspense>
      </Container>
    );
  }

  const { futureEvents, pastEvents } = divideEventsByDateTime<Event>(events);
  const sortedFutureEvents = sortedEventsByDate(futureEvents);
  const sortedPastEvents = sortedEventsByDate(pastEvents, 'past');

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <EventsTabs
          dictionary={dictionary}
          lang={lang}
          sportTypes={sportTypes}
          futureEvents={sortedFutureEvents}
          pastEvents={sortedPastEvents}
        />
      </Suspense>
    </Container>
  );
}
