import { EventsTabs } from './events-tabs';
import { Event } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testData } from '@/lib/constants';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { getEvents } from '@/lib/actions/events';
import { divideEventsByDateTime } from '@/lib/utils/date-and-time';
import { sortedEventsByDate } from '@/lib/utils/filters';

export default async function Events({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const dictionary = page.events;
  let events: Event[];
  try {
    events = await getEvents();
  } catch (err) {
    events = [];
  }

  const { futureEvents, pastEvents } = divideEventsByDateTime([...events]); // remove spreading after testing
  const sortedFutureEvents = sortedEventsByDate(futureEvents);
  const sortedPastEvents = sortedEventsByDate(pastEvents);

  const usersEvents: Event[] = [];

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
