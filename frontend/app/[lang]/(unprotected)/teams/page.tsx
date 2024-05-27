import React from 'react';
import { Container } from '@/components/container';
import { TeamsListing } from './teams-listing';
import { Locale } from '@/i18n.config';
import {
  calculateAge,
  calculateGender,
  defineDefaultRange,
  expandRange,
} from '@/lib/utils';
import { Country, AllRegions } from '@/lib/definitions';
import { getDictionary } from '@/lib/dictionary';
import { teamsApi } from '@/lib/api/teamsApi';

interface TeamInfo {
  id: number;
  name: string;
  description: string;
  slug: string;
  invite_link: string;
  image_field: string;
  country: number;
  city: string;
  region: number;
}

interface CaptainInfo {
  sirname: string;
  name: string;
  fathername: string;
}

interface MemberPersonalInfo {
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
}

interface MemberAthleteInfo {
  height: number;
  weight: number;
  country: number;
  region: number;
  city: string;
}

interface MemberSportTypes extends Array<string> {}

type Gender = 'male' | 'female' | 'mixed' | '';

interface TeamMember {
  personalInfo: MemberPersonalInfo;
  athleteInfo: MemberAthleteInfo;
  sportTypes: string[];
}

export interface Team extends TeamInfo {
  captain: CaptainInfo;
  gender: Gender;
  weights: number[];
  ages: number[];
  location: string;
  sportTypes: string[];
}

export type TeamDataFromServer = [
  TeamInfo,
  CaptainInfo,
  [MemberPersonalInfo, MemberAthleteInfo, MemberSportTypes][],
];

const testTeam: TeamDataFromServer = [
  {
    id: 0,
    name: 'Тестовая команда',
    description:
      'Описание тестовой команды: четко увеличиваться эффект пропадать зато.',
    slug: '',
    invite_link: '2b806bdf-49b3-48c3-ba17-dee2637294ed',
    image_field: 'https://picsum.photos/374/586',
    country: 1,
    city: 'г. Ноглики',
    region: 8,
  },
  {
    sirname: 'Наумова',
    name: 'Филипп',
    fathername: 'Федор',
  },
  [
    [
      {
        sirname: 'Наумова',
        name: 'Филипп',
        fathername: 'Федор',
        birthdate: '2020-11-10',
        gender: true,
      },
      {
        height: 132,
        weight: 127.0,
        country: 3,
        region: 17,
        city: 'д. Ессентуки',
      },
      [
        'Самбо',
        'Спортивный ножевой бой',
        'Практическая стрельба',
        'Спортивное метание ножа',
      ],
    ],
  ],
];

export default async function Teams({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const dictionary = page.teams;

  let teams: Team[] = [];
  const weightRange = [250, 1];
  const ageRange = [100, 1];

  const transformTeamData = (team: TeamDataFromServer): Team => {
    const [teamInfo, captainInfo, members] = team;

    const sportTypes = Array.from(
      new Set(members.flatMap((member) => member[2])),
    );
    const gender = calculateGender(members.map((member) => member[0].gender));
    const weights = members
      .map((member) => member[1].weight)
      .sort((a, b) => a - b);
    const ages = members
      .map((member) => calculateAge(member[0].birthdate))
      .sort((a, b) => a - b);
    const location = `${teamInfo.city}, ${AllRegions[teamInfo.region]}, ${Country[teamInfo.country]}`;

    return {
      ...teamInfo,
      captain: captainInfo,
      sportTypes,
      gender,
      weights,
      ages,
      location,
    };
  };

  const updateRanges = (
    teams: Team[],
    weightRange: number[],
    ageRange: number[],
  ) => {
    teams.forEach((team) => {
      const minWeight = Math.min(...team.weights);
      const maxWeight = Math.max(...team.weights);
      weightRange[0] = Math.min(weightRange[0], minWeight);
      weightRange[1] = Math.max(weightRange[1], maxWeight);

      const minAge = Math.min(...team.ages);
      const maxAge = Math.max(...team.ages);
      ageRange[0] = Math.min(ageRange[0], minAge);
      ageRange[1] = Math.max(ageRange[1], maxAge);
    });
  };

  try {
    const teamData: TeamDataFromServer[] = await teamsApi.getTeams();
    teams = [testTeam, ...teamData].map(transformTeamData);
    updateRanges(teams, weightRange, ageRange);
  } catch (err) {
    console.error('Failed to fetch teams data:', err);
  }

  const weightRangeWithExpad = expandRange(weightRange, 10);
  const ageRangeWithExpand = expandRange(ageRange, 5);
  const weightDefaults = defineDefaultRange(weightRangeWithExpad);
  const ageDefaults = defineDefaultRange(ageRangeWithExpand);

  return (
    <Container>
      <TeamsListing
        teams={teams}
        weightRange={weightRangeWithExpad}
        ageRange={ageRangeWithExpand}
        weightDefaults={weightDefaults}
        ageDefaults={ageDefaults}
        lang={lang}
        dictionary={dictionary}
      />
    </Container>
  );
}
