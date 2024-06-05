import { AddressSection } from './address-section';
import { Container } from '@/components/container';
import { ExpectedEvents } from './expected-events';
import { PageWithInfo } from '@/components/page-with-info';
import { EventOwnerTabs, EventTabs, UserInfo } from '@/lib/definitions';
import { testData, testGridData } from '@/lib/constants';
import { MatchesEvent } from './matches-event';
import { Grid } from './grid';
import { EventActionButtons } from './event-action-buttons';
import { Locale } from '@/i18n.config';
import { H4 } from '@/components/text';
import { InfoEvent } from './info-event';
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
import {
  fetchEvent,
  fetchEvents,
  fetchMatches,
  fetchParticipants,
} from '@/lib/data';

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

export interface GridInfo {
  method: string;
  age_grade: number;
  sport_name: string;
  weight_category: string;
  gender: string;
}

interface GridFightInfo {
  fight_id: number;
  mat_number: number;
  start_time: string;
}

export interface GridPlayer {
  player_id: number;
  first_name: string;
  last_name: string;
  birthdate: string;
  team_name: string;
  team_id: number;
  points: number;
}

export interface GridFight {
  fight_info: GridFightInfo;
  player_1: GridPlayer;
  player_2: GridPlayer;
}

export interface GridRound {
  name: string;
  fights: GridFight[];
}

export interface GridData {
  grid_info: GridInfo;
  rounds: GridRound[];
}

export default async function EventPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event, events, matches, participants] = await Promise.all([
    getSession(),
    fetchEvent(id),
    fetchEvents(),
    fetchMatches(id),
    fetchParticipants(id),
  ]);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOwner = user?.roleInfo.id === event?.organizer_id;
  const randomInt = getRandomInt(100);
  const expectedEvents = getExpectedEvents(events, randomInt, 16);
  const weights = participants
    .map((participant) => participant.weight)
    .sort((a, b) => +a - +b);
  const ages = participants
    .map((participant) => calculateAge(participant.birthdate))
    .sort((a, b) => +a - +b);

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
      value: match?.start_datetime || '',
      displayedValue: transformDate(match?.start_datetime) || '',
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
    value: matchDates[0]?.value || '',
    displayedValue: transformDate((matchDates[0]?.value as string) || ''),
  };
  const matchesEnd: ValueOption = {
    value: matchDates[matchDates.length - 1]?.value || '',
    displayedValue: transformDate(
      (matchDates[matchDates.length - 1]?.value as string) || '',
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
    [EventTabs['grid']]: (
      <Grid info={testGridData.grid_info} rounds={testGridData.rounds} />
    ),
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
