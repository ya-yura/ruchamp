import React from 'react';
import { Container } from '@/components/container';
import { PageWithInfo } from '@/components/page-with-info';
import {
  getSession,
  getTeam,
  getTeamMatches,
  getTeamResults,
} from '@/lib/actions';
import { TeamActionButtons } from './team-action-buttons';
import { TeamTabs } from '@/lib/definitions';
import { InfoTeam } from './info-team';
import { AthletesTeam } from './athletes-team';
import { MatchesTeam } from './matches-team';
import {
  calculateAge,
  filterDuplicates,
  roundToBase,
  transformDate,
} from '@/lib/utils';
import { testMatches, testResults, testTeam } from '@/lib/constants';
import { Locale } from '@/i18n.config';
import { Results } from '@/components/results/results';

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
  const session = await getSession();
  const lang = params.lang;
  const id = params.id;
  const team: TeamByIdFromServer = await getTeam(id, session.token);
  const matches: TeamMatch[] = await getTeamMatches(id);
  const results: TeamMemberWithResults[] = await getTeamResults(id);
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

  const rangesFromArray = (array: number[], step: number): ValueOption[] => {
    let res: number[][] = [];
    array.forEach((i) => {
      const min = roundToBase(i, step, 'down');
      const max = roundToBase(i, step, 'up');
      let range: number[] = [];
      if (min === max) {
        range = [max - step, max];
      } else range = [min, max];
      const stringifyedRes = res.map((i) => JSON.stringify(i));
      const stringifyedRange = JSON.stringify(range);
      !stringifyedRes.includes(stringifyedRange) && res.push(range);
    });
    return res.map((i) => ({
      value: i,
      displayedValue: i.join(' – '),
    }));
  };

  const weights = members
    .map((member) => member.weight)
    .sort((a, b) => +a - +b);

  const grades = (): ValueOption[] => {
    const memberGrades = [
      ...new Set(members.flatMap((member) => member.grade_types)),
    ].sort();
    return memberGrades.map((grade) => ({
      value: grade,
      displayedValue: grade,
    }));
  };

  const ages = members
    .map((member) => calculateAge(member.birthdate))
    .sort((a, b) => +a - +b);

  const genderFilterData: FilterData = {
    id: 'genders',
    title: 'Пол',
    type: 'value',
    options: [
      {
        value: 'male',
        displayedValue: 'Мужской',
      },
      {
        value: 'female',
        displayedValue: 'Женский',
      },
    ],
  };

  const weightFilterData: FilterData = {
    id: 'weights',
    title: 'Вес, кг',
    type: 'range',
    options: rangesFromArray(weights, 5),
  };

  const gradeFilterData: FilterData = {
    id: 'grades',
    title: 'Уровень спортсмена',
    type: 'array',
    options: grades(),
  };

  const ageFilterData: FilterData = {
    id: 'ages',
    title: 'Возраст, лет',
    type: 'range',
    options: rangesFromArray(ages, 5),
  };

  function sortAndGroupMatches(matches: TeamMatch[]) {
    matches.sort((a, b) => {
      if (a.start_datetime < b.start_datetime) return -1;
      if (a.start_datetime > b.start_datetime) return 1;
      if (a.event_id < b.event_id) return -1;
      if (a.event_id > b.event_id) return 1;
      return 0;
    });

    const groupedMatches = matches.reduce<Record<number, GroupedMatch>>(
      (acc, match) => {
        if (!acc[match.event_id]) {
          acc[match.event_id] = {
            event_id: match.event_id,
            name: match.name,
            location: match.location,
            start_datetime: transformDate(match.start_datetime),
            matches: [],
          };
        }
        acc[match.event_id].matches.push(match);
        return acc;
      },
      {},
    );

    return Object.values(groupedMatches);
  }

  const sortedAndGroupedMatches = sortAndGroupMatches(matches);

  function getAthletesByMedal(
    medal: 'Золото' | 'Серебро' | 'Бронза',
  ): MedalWinner[] {
    let res: MedalWinner[] = [];
    results.forEach((athlete) =>
      athlete.matches_info.forEach((match) => {
        if (match.medal_type === medal) {
          res.push({
            id: athlete.id,
            sirname: athlete.sirname,
            name: athlete.name,
            fathername: athlete.fathername,
            birthdate: athlete.birthdate,
            gender: athlete.gender,
            height: athlete.height,
            weight: athlete.weight,
            image_field: athlete.image_field,
            country: athlete.country,
            region: athlete.region,
            city: athlete.city,
            event_id: match.event_id,
            event_name: match.event_name,
            match_id: match.match_id,
            match_name: match.match_name,
            event_location: match.event_location,
            start_datetime: match.start_datetime,
            sport_type: match.sport_type,
          });
        }
      }),
    );
    return res;
  }

  const goldenMedalWinners = getAthletesByMedal('Золото');
  const silverMedalWinners = getAthletesByMedal('Серебро');
  const bronzeMedalWinners = getAthletesByMedal('Бронза');

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
      <AthletesTeam
        athletes={members}
        captainId={captainId}
        genderFilterData={genderFilterData}
        weightFilterData={weightFilterData}
        gradeFilterData={gradeFilterData}
        ageFilterData={ageFilterData}
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
