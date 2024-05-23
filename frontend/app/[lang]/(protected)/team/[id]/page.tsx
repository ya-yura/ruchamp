import React from 'react';
import { Container } from '@/components/container';
import { PageWithInfo } from '@/components/page-with-info';
import { getSession, getTeam } from '@/lib/actions';
import { TeamActionButtons } from './team-action-buttons';
import { TeamTabs } from '@/lib/definitions';
import { InfoTeam } from './info-team';
import { AthletesTeam } from './athletes-team';
import { MatchesTeam } from './matches-team';
import { ResultsTeam } from './results-team';
import { calculateAge, filterDuplicates, roundToBase } from '@/lib/utils';
import { testTeam } from '@/lib/constants';

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

export interface TeamByIdFromServer {
  Team: TeamInfo;
  Captain: CaptainId;
  Members: TeamMember[];
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const id = params.id;
  const team: TeamByIdFromServer = await getTeam(id, session.token);
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

  const tabsContent: Record<TeamTabs, React.ReactNode> = {
    [TeamTabs['info']]: (
      <InfoTeam teamInfo={teamInfo} captain={captain} coaches={coaches} />
    ),
    [TeamTabs['athletes']]: (
      <AthletesTeam
        athletes={members}
        captainId={captainId}
        genderFilterData={genderFilterData}
        weightFilterData={weightFilterData}
        gradeFilterData={gradeFilterData}
        ageFilterData={ageFilterData}
      />
    ),
    [TeamTabs['matches']]: <MatchesTeam />,
    [TeamTabs['results']]: <ResultsTeam />,
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
      />
    </Container>
  );
}
