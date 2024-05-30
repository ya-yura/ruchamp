import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { EventTabs } from '@/lib/definitions';
import { testData } from '@/lib/constants';
import { MatchesEvent } from './matches-event';
import { Grid } from './grid';
import { Results } from './results';
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
  filterDuplicates,
  filterUniqueDisplayedValues,
  getExpectedEvents,
} from '@/lib/utils/other-utils';

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
  name: string;
  start_datetime: string;
  end_datetime: string;
  sport_name: string;
  gender: boolean;
  weight_category: string;
  category_type: string;
}

async function fetchEventData(eventId: string) {
  try {
    const event = await getEvent(eventId);
    const events = await getEvents();
    const participants = await getMatchesParticipants(eventId);
    const matches = await getEventMatches(eventId);
    return { event, events, participants, matches };
  } catch (error) {
    console.error('Error fetching event data:', error);
    return { event: null, events: [], participants: [], matches: [] };
  }
}

export default async function EventPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const randomInt = getRandomInt(100);
  const { event, events, participants, matches } = await fetchEventData(id);
  const expectedEvents = getExpectedEvents(events, randomInt, 16);
  const weights = participants
    .map((participant) => participant.weight)
    .sort((a, b) => +a - +b);
  const ages = participants
    .map((participant) => calculateAge(participant.birthdate))
    .sort((a, b) => +a - +b);

  function getGradesOptions(): ValueOption[] {
    const participantGrades = [
      ...new Set(participants.flatMap((participant) => participant.grade)),
    ].sort();
    return participantGrades.map((grade) => ({
      value: grade,
      displayedValue: grade,
    }));
  }

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
    .map((match) => ({
      value: match.start_datetime,
      displayedValue: transformDate(match.start_datetime),
    }))
    .sort((a, b) => {
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
    displayedValue: transformDate(event?.end_datetime || ''),
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

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого мероприятия не найдено</H4>
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
    [EventTabs['results']]: <Results />,
  };

  return (
    <Container>
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
      <AddressSection event={event} />
      {events.length > 0 && <ExpectedEvents events={expectedEvents} />}
    </Container>
  );
}
