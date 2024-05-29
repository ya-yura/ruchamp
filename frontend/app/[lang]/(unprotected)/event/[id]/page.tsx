import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { Event, EventTabs } from '@/lib/definitions';
import { getRandomInt } from '@/lib/utils';
import { testData } from '@/lib/constants';
import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { EventActionButtons } from './event-action-buttons';
import { Locale } from '@/i18n.config';
import { getEvent, getEvents } from '@/lib/actions/events';

export default async function EventPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const lang = params.lang;
  const id = params.id;
  let events: Event[];
  let expectedEvents: Event[];
  const event: Event = await getEvent(id);
  const randomInt = getRandomInt(100);

  try {
    events = await getEvents();
  } catch (err) {
    console.log('Error while loading event info', err);
    events = [];
  }

  if (events.length > 3) {
    expectedEvents = events.slice(randomInt, randomInt + 16);
  } else if (events.length > 0 && events.length < 4) {
    expectedEvents = events.slice(0, events.length);
  } else {
    expectedEvents = [];
  }

  const tabsContent: Record<EventTabs, React.ReactNode> = {
    [EventTabs['info']]: <Info event={event} />,
    [EventTabs['athletes']]: <Athletes />,
    [EventTabs['matches']]: <Matches />,
    [EventTabs['grid']]: <Grid />,
    [EventTabs['results']]: <Results />,
  };

  return (
    <Container>
      <PageWithInfo<EventTabs>
        id={event.id}
        type={'event'}
        title={event.name}
        bages={['Убрать', 'Этот', 'Хардкод']}
        buttons={<EventActionButtons />}
        tabsContent={tabsContent}
        tabsObj={EventTabs}
        lang={lang}
      />
      <AddressSection event={event} />
      <ExpectedEvents events={expectedEvents} />
    </Container>
  );
}
