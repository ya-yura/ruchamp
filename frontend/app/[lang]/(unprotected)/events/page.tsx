import { EventsTabs } from './events-tabs';
import { Event } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testData } from '@/lib/constants';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { divideEventsByDateTime } from '@/lib/utils/date-and-time';
import { sortedEventsByDate } from '@/lib/utils/filters';
import { fetchEvents } from '@/lib/data';

export default async function Events({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const events: Event[] = await fetchEvents();
  const usersEvents: Event[] = []; // make this logic later
  const dictionary = page.events;

  const { futureEvents, pastEvents } = divideEventsByDateTime(events);
  const sortedFutureEvents = sortedEventsByDate(futureEvents);
  const sortedPastEvents = sortedEventsByDate(pastEvents);

  return (
    <Container>
      <EventsTabs
        dictionary={dictionary}
        lang={lang}
        futureEvents={sortedFutureEvents}
        pastEvents={sortedPastEvents}
        usersEvents={usersEvents}
      />
    </Container>
  );
}
