import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { Event, EventTabs } from '@/lib/definitions';
import { getRandomInt } from '@/lib/utils';
import { testData } from '@/lib/constants';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { EventActionButtons } from './event-action-buttons';
import { Locale } from '@/i18n.config';
import { getEvent, getEvents } from '@/lib/actions/events';
import { H4 } from '@/components/text';
import { InfoEvent } from './info-event';

const MAX_EXPECTED_EVENTS = 16;

async function fetchEventData(eventId: string) {
  try {
    const event = await getEvent(eventId);
    const events = await getEvents();
    return { event, events };
  } catch (error) {
    console.error('Error fetching event data:', error);
    return { event: null, events: [] };
  }
}

function getExpectedEvents(events: Event[], randomInt: number) {
  if (events.length > 3) {
    return events.slice(randomInt, randomInt + MAX_EXPECTED_EVENTS);
  }
  return events.length > 0 ? events.slice(0, events.length) : [];
}

export default async function EventPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const randomInt = getRandomInt(100);
  const { event, events } = await fetchEventData(id);
  const expectedEvents = getExpectedEvents(events, randomInt);

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого мероприятия не найдено</H4>
      </Container>
    );
  }

  const tabsContent = {
    [EventTabs['info']]: <InfoEvent event={event} />,
    [EventTabs['athletes']]: <Athletes />,
    [EventTabs['matches']]: <Matches />,
    [EventTabs['grid']]: <Grid />,
    [EventTabs['results']]: <Results />,
  };

  return (
    <Container>
      <PageWithInfo<EventTabs>
        id={event.id}
        type="event"
        title={event.name}
        bages={['Убрать', 'Этот', 'Хардкод']}
        buttons={<EventActionButtons />}
        tabsContent={tabsContent}
        tabsObj={EventTabs}
        lang={lang}
      />
      <AddressSection event={event} />
      {events.length > 0 && <ExpectedEvents events={expectedEvents} />}
    </Container>
  );
}
