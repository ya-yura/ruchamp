import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { eventsApi } from '@/lib/api/eventsApi';
import { Event } from '@/lib/definitions';
import { getRandomInt } from '@/lib/utils';
import { testData } from '@/lib/constants';
import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { EventActionButtons } from './event-action-buttons';

export enum EventTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Матчи',
  'grid' = 'Турнирная сетка',
  'results' = 'Результаты',
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  let events: Event[];
  let expectedEvents: Event[];
  const event: Event =
    +id > 1000000
      ? (testData.find((event) => event.id === +id) as Event)
      : await eventsApi.getEvent(id);
  const randomInt = getRandomInt(100);

  try {
    events = await eventsApi.getEvents();
  } catch (err) {
    console.log('error', err);
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
      />
      <AddressSection event={event} />
      <ExpectedEvents events={expectedEvents} />
    </Container>
  );
}
