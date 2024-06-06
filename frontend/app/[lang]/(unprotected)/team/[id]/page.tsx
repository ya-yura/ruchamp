import React from 'react';
import { Container } from '@/components/container';
import { PageWithInfo } from '@/components/page-with-info';
import { TeamActionButtons } from './team-action-buttons';
import { TeamTabs } from '@/lib/definitions';
import { InfoTeam } from './info-team';
import { AthletesCardsWithFilters } from '@/components/cards/athletes-cards-with-filters';
import { MatchesTeam } from './matches-team';
import { testMatches, testResults, testTeam } from '@/lib/constants';
import { Locale } from '@/i18n.config';
import { Results } from '@/components/results/results';
import {
  createFilter,
  genderOptions,
  getAthletesByMedal,
  rangesFromArray,
  sortAndGroupMatches,
} from '@/lib/utils/filters';
import { calculateAge } from '@/lib/utils/date-and-time';
import { filterDuplicates } from '@/lib/utils/other-utils';
import { fetchTeam, fetchTeamMatches, fetchTeamResults } from '@/lib/data';

export interface ValueOption {
  value: string | number[];
  displayedValue: string;
}

export interface FilterData {
  id: string;
  title: string;
  type?: 'value' | 'range' | 'array';
  options: ValueOption[];
}

export interface TeamInfo {
  id: number;
  name: string;
  image_field: string;
  description: string;
  invite_link: string;
  slug: string;
  country: number;
  city: string;
  region: number;
}

export interface CaptainId {
  user_id: number;
}

export interface Coach {
  sirname: string;
  name: string;
  fathername: string;
  qualification_level: number;
}

export interface TeamMember {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
  height: number;
  weight: number;
  image_field: string;
  country: number;
  region: number;
  city: string;
  sport_types: string[];
  grade_types: string[];
  coaches: Coach[];
}

interface MatchInfo {
  event_id: number;
  event_name: string;
  event_location: string;
  match_id: number;
  match_name: string;
  start_datetime: string;
  sport_type: string;
  medal_type: string;
}

export interface Medals {
  golden: number;
  silver: number;
  bronze: number;
}
export interface TeamMemberWithResults
  extends Omit<TeamMember, 'coaches' | 'grade_types' | 'sport_types'> {
  matches_info: MatchInfo[];
  medals: Medals;
  points: number;
}

export interface TeamByIdFromServer {
  Team: TeamInfo;
  Captain: CaptainId;
  Members: TeamMember[];
}

export interface TeamMatch {
  match_id: number;
  event_id: number;
  name: string;
  location: string;
  org_name: string;
  sport_type: string;
  grade: string;
  start_datetime: string;
  end_datetime: string;
  nominal_time: number;
  mat_vol: number;
  age_min: number;
  age_max: number;
  weight_class: string;
  gender?: boolean;
}

export interface GroupedMatch {
  event_id: number;
  name: string;
  location: string;
  start_datetime: string;
  matches: TeamMatch[];
}

export interface MedalWinner {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender?: boolean;
  height: number;
  weight: number;
  image_field: string;
  country: number;
  region: number;
  city: string;
  event_id: number;
  event_name: string;
  match_id: number;
  match_name?: string;
  event_location: string;
  start_datetime: string;
  sport_type: string;
}

export default async function TeamPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const lang = params.lang;
  const id = params.id;
  const [team, matches, results] = await Promise.all([
    fetchTeam(id),
    fetchTeamMatches(id),
    fetchTeamResults(id),
  ]);
  const teamInfo = team.Team;
  const members = team.Members;
  const captainId = team.Captain.user_id;

  const captain: TeamMember | undefined = members.find(
    (member) => member.id === captainId,
  );

  const coaches = filterDuplicates<Coach>(
    members.flatMap((member) => member.coaches),
  );

  const sportTypes: string[] = [
    ...new Set(members.flatMap((member) => member.sport_types)),
  ];

  const weights = members
    .map((member) => member.weight)
    .sort((a, b) => +a - +b);

  const ages = members
    .map((member) => calculateAge(member.birthdate))
    .sort((a, b) => +a - +b);

  function getGradesOptions(): ValueOption[] {
    const memberGrades = [
      ...new Set(members.flatMap((member) => member.grade_types)),
    ].sort();
    return memberGrades.map((grade) => ({
      value: grade,
      displayedValue: grade,
    }));
  }

  const gradesOptions = getGradesOptions();
  const weightOptions = rangesFromArray(weights, 5);
  const ageOptions = rangesFromArray(ages, 5);

  const genderFilterData: FilterData = createFilter(
    'genders',
    'Пол',
    genderOptions,
  );
  const weightFilterData = createFilter('weights', 'Вес, кг', weightOptions);
  const gradeFilterData = createFilter('grades', 'Уровень', gradesOptions);
  const ageFilterData = createFilter('ages', 'Возраст, лет', ageOptions);
  const filtersData: FilterData[] = [
    genderFilterData,
    weightFilterData,
    gradeFilterData,
    ageFilterData,
  ];

  const sortedAndGroupedMatches = sortAndGroupMatches(matches);

  const goldenMedalWinners = getAthletesByMedal(results, 'Золото');
  const silverMedalWinners = getAthletesByMedal(results, 'Серебро');
  const bronzeMedalWinners = getAthletesByMedal(results, 'Бронза');

  const sortedAthelesResults = results.sort((a, b) => b.points - a.points);

  const tabsContent: Record<TeamTabs, React.ReactNode> = {
    [TeamTabs['info']]: (
      <InfoTeam
        teamInfo={teamInfo}
        captain={captain}
        coaches={coaches}
        lang={lang}
      />
    ),
    [TeamTabs['athletes']]: (
      <AthletesCardsWithFilters
        athletes={members}
        captainId={captainId}
        filtersData={filtersData}
        lang={lang}
      />
    ),
    [TeamTabs['matches']]: (
      <MatchesTeam
        groupedMatches={sortedAndGroupedMatches}
        length={matches.length || 0}
        lang={lang}
      />
    ),
    [TeamTabs['results']]: (
      <Results
        goldenMedalWinners={goldenMedalWinners}
        silverMedalWinners={silverMedalWinners}
        bronzeMedalWinners={bronzeMedalWinners}
        athletes={sortedAthelesResults}
      />
    ),
  };

  return (
    <Container>
      <PageWithInfo<TeamTabs>
        id={team.Team.id}
        type={'team'}
        title={team.Team.name}
        bages={sportTypes}
        buttons={<TeamActionButtons />}
        tabsContent={tabsContent}
        tabsObj={TeamTabs}
        lang={lang}
      />
    </Container>
  );
}
