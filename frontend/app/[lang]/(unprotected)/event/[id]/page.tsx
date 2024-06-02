import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { EventOwnerTabs, EventTabs, UserInfo } from '@/lib/definitions';
import { testData } from '@/lib/constants';
import { MatchesEvent } from './matches-event';
import { Grid } from './grid';
import { EventActionButtons } from './event-action-buttons';
import { Locale } from '@/i18n.config';
import { getEvent, getEventMatches, getEvents } from '@/lib/actions/events';
import { H4 } from '@/components/text';
import { InfoEvent } from './info-event';
import { getMatchesParticipants } from '@/lib/actions/matches';
import { FilterData, TeamMember, ValueOption } from '../../team/[id]/page';
import { AthletesCardsWithFilters } from '@/components/cards/athletes-cards-with-filters';
import {
  createFilter,
  genderOptions,
  rangesFromArray,
} from '@/lib/utils/filters';
import { calculateAge, transformDate } from '@/lib/utils/date-and-time';
import { getRandomInt } from '@/lib/utils/math-utils';
import {
  filterUniqueDisplayedValues,
  getExpectedEvents,
} from '@/lib/utils/other-utils';
import { getSession } from '@/lib/actions/auth';
import { OwnerMain } from './owner-main';
import { OwnerTeams } from './owner-teams';
import { OwnerDocs } from './owner-docs';
import { Results } from '@/components/results/results';

export interface Participant
  extends Omit<
    TeamMember,
    'sport_types' | 'grade_types' | 'coaches' | 'height' | 'id'
  > {
  user_id: number;
  team: string;
  grade: string;
}

export interface EventMatch {
  id: number;
  name: string | null;
  start_datetime: string;
  end_datetime: string;
  sport_name: string;
  gender: boolean;
  weight_category: string;
  category_type: string;
}

// async function fetchEventData(eventId: string) {
//   try {
//     const session = await getSession();
//     const event = await getEvent(eventId);
//     const events = await getEvents();
//     const participants = await getMatchesParticipants(eventId);
//     const matches = await getEventMatches(eventId);
//     return { event, events, participants, matches, session };
//   } catch (error) {
//     console.error('Error fetching event data:', error);
//     return {
//       event: null,
//       events: [],
//       participants: [],
//       matches: [],
//       session: null,
//     };
//   }
// }

async function fetchData(fetchFn: any, errorText: string) {
  try {
    const data = await fetchFn();
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${errorText}:`, error);
    return { data: [], error };
  }
}

async function fetchEventData(eventId: string) {
  const sessionPromise = fetchData(getSession, 'user');
  const eventPromise = fetchData(() => getEvent(eventId), 'event');
  const eventsPromise = fetchData(getEvents, 'events');
  const participantsPromise = fetchData(
    () => getMatchesParticipants(eventId),
    'participants',
  );
  const fetchedMatchesPromise = fetchData(
    () => getEventMatches(eventId),
    'matches',
  );

  const [
    sessionResult,
    eventResult,
    eventsResult,
    participantsResult,
    fetchedMatchesResult,
  ] = await Promise.all([
    sessionPromise,
    eventPromise,
    eventsPromise,
    participantsPromise,
    fetchedMatchesPromise,
  ]);

  return {
    session: sessionResult.data,
    event: eventResult.data,
    events: eventsResult.data,
    participants: participantsResult.data,
    fetchedMatches: fetchedMatchesResult.data,
    errors: {
      session: sessionResult.error,
      event: eventResult.error,
      events: eventsResult.error,
      participants: participantsResult.error,
      fetchedMatches: fetchedMatchesResult.error,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const randomInt = getRandomInt(100);
  const { event, events, participants, fetchedMatches, session } =
    await fetchEventData(id);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOwner = user?.roleInfo.id === event?.organizer_id;
  const expectedEvents = getExpectedEvents(events, randomInt, 16);
  const weights = participants
    .map((participant: Participant) => participant.weight)
    .sort((a: Participant, b: Participant) => +a - +b);
  const ages = participants
    .map((participant: Participant) => calculateAge(participant.birthdate))
    .sort((a: Participant, b: Participant) => +a - +b);

  let matches: EventMatch[] = !!fetchedMatches.length
    ? fetchedMatches
    : [
        {
          id: 1,
          name: null,
          start_datetime: '2024-05-21T10:29:12.818092',
          end_datetime: '2024-05-21T10:39:12.818092',
          sport_name: 'Дзюдо',
          gender: true,
          weight_category: 'Тяжёлый',
          category_type: '1-й юношеский разряд',
        },
        {
          id: 2,
          name: 'Соревнования за выход на улицу',
          start_datetime: '2024-05-21T10:29:12.818092',
          end_datetime: '2024-05-21T10:39:12.818092',
          sport_name: 'Самбо',
          gender: true,
          weight_category: 'Тяжёлый',
          category_type: '1-й юношеский разряд',
        },
      ];

  const gradesOptions = getGradesOptions();
  const weightOptions = rangesFromArray(weights, 5);
  const ageOptions = rangesFromArray(ages, 5);

  const genderFilterData = createFilter('genders', 'Пол', genderOptions);
  const weightFilterData = createFilter('weights', 'Вес, кг', weightOptions);
  const gradeFilterData = createFilter('grades', 'Уровень', gradesOptions);
  const ageFilterData = createFilter('ages', 'Возраст, лет', ageOptions);
  const filtersData: FilterData[] = [
    genderFilterData,
    weightFilterData,
    gradeFilterData,
    ageFilterData,
  ];

  const allMatchDates: ValueOption[] = matches
    .map((match: EventMatch) => ({
      value: match.start_datetime,
      displayedValue: transformDate(match.start_datetime),
    }))
    .sort((a: ValueOption, b: ValueOption) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });

  const matchDates = filterUniqueDisplayedValues(allMatchDates);

  const regStart: ValueOption = {
    value: event?.start_request_datetime || '',
    displayedValue: transformDate(event?.start_request_datetime || ''),
  };
  const regEnd: ValueOption = {
    value: event?.end_request_datetime || '',
    displayedValue: transformDate(event?.end_request_datetime || ''),
  };
  const matchesStart: ValueOption = {
    value: matchDates[0].value || '',
    displayedValue: transformDate((matchDates[0].value as string) || ''),
  };
  const matchesEnd: ValueOption = {
    value: matchDates[matchDates.length - 1].value || '',
    displayedValue: transformDate(
      (matchDates[matchDates.length - 1].value as string) || '',
    ),
  };
  const awardingTime: ValueOption = matchesEnd;

  function getGradesOptions(): ValueOption[] {
    const participantGrades = [
      ...new Set(
        participants.flatMap((participant: Participant) => participant.grade),
      ),
    ].sort();
    return participantGrades.map((grade) => ({
      value: grade as string,
      displayedValue: grade as string,
    }));
  }

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого события не найдено</H4>
      </Container>
    );
  }

  const tabsContent = {
    [EventTabs['info']]: <InfoEvent event={event} />,
    [EventTabs['athletes']]: (
      <AthletesCardsWithFilters
        athletes={participants}
        filtersData={filtersData}
        lang={lang}
      />
    ),
    [EventTabs['matches']]: (
      <MatchesEvent
        matches={matches}
        matchDates={matchDates}
        regStart={regStart}
        regEnd={regEnd}
        matchesStart={matchesStart}
        matchesEnd={matchesEnd}
        awardingTime={awardingTime}
      />
    ),
    [EventTabs['grid']]: <Grid />,
    [EventTabs['results']]: (
      <Results
        athletes={[]}
        goldenMedalWinners={[]}
        silverMedalWinners={[]}
        bronzeMedalWinners={[]}
      />
    ),
  };

  const tabsOwnerContent = {
    [EventOwnerTabs['main']]: (
      <OwnerMain matches={matches} matchDates={matchDates} />
    ),
    [EventOwnerTabs['teams']]: <OwnerTeams />,
    [EventOwnerTabs['results']]: (
      <Results
        athletes={[]}
        goldenMedalWinners={[]}
        silverMedalWinners={[]}
        bronzeMedalWinners={[]}
      />
    ),
    [EventOwnerTabs['docs']]: <OwnerDocs />,
  };

  return (
    <Container>
      {isOwner ? (
        <PageWithInfo<EventOwnerTabs>
          id={event.id}
          type="event"
          title={event.name}
          bages={event.sports_in_matches}
          buttons={<EventActionButtons isOwner={isOwner} />}
          tabsContent={tabsOwnerContent}
          tabsObj={EventOwnerTabs}
          isOwner={isOwner}
          lang={lang}
        />
      ) : (
        <PageWithInfo<EventTabs>
          id={event.id}
          type="event"
          title={event.name}
          bages={event.sports_in_matches}
          buttons={<EventActionButtons />}
          tabsContent={tabsContent}
          tabsObj={EventTabs}
          lang={lang}
        />
      )}
      <AddressSection event={event} />
      {events.length > 0 && <ExpectedEvents events={expectedEvents} />}
    </Container>
  );
}
