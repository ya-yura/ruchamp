import { EventsTabs } from './events-tabs';
import { eventsApi } from '@/lib/api/eventsApi';
import { Event } from '@/lib/definitions';
import { Container } from '@/components/container';
import { testData } from '@/lib/constants';
import { divideEventsByDateTime } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export default async function Events({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const dictionary = page.events;
  let events: Event[];
  try {
    events = await eventsApi.getEvents();
  } catch (err) {
    events = [];
  }

  const usersEvents: Event[] = [];

  const { futureEvents, pastEvents } = divideEventsByDateTime([
    ...events,
    ...testData,
  ]);

  // When data will be real, make proper sorting
  futureEvents.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });
  pastEvents.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Container>
      <EventsTabs
        dictionary={dictionary}
        lang={lang}
        futureEvents={futureEvents}
        pastEvents={pastEvents}
        usersEvents={usersEvents}
      />
    </Container>
  );
}
