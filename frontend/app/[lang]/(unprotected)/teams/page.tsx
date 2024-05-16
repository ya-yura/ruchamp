import React from 'react';
import { Container } from '@/components/container';
import { TeamsListing } from './teams-listing';
import { getTeams } from '@/lib/actions';
import { Locale } from '@/i18n.config';
import { calculateAge, calculateGender } from '@/lib/utils';
import { Country, Region } from '@/lib/definitions';
import { getDictionary } from '@/lib/dictionary';

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
}

type TeamDataFromServer = [
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
        birthdate: '1980-11-10',
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
    [
      {
        sirname: 'Мамонтов',
        name: 'Лука',
        fathername: 'Андроник',
        birthdate: '1984-02-22',
        gender: true,
      },
      {
        height: 129,
        weight: 104.0,
        country: 2,
        region: 17,
        city: 'с. Щелково',
      },
      ['Сумо', 'Бокс', 'Самбо', 'Спортивное метание ножа'],
    ],
    [
      {
        sirname: 'Мамонтов',
        name: 'Лука',
        fathername: 'Андроник',
        birthdate: '1984-02-22',
        gender: true,
      },
      {
        height: 129,
        weight: 110.0,
        country: 2,
        region: 17,
        city: 'с. Щелково',
      },
      ['Сумо', 'Бокс', 'Самбо', 'Спортивное метание ножа'],
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
  const teamData: TeamDataFromServer[] = await getTeams();
  const teams: Team[] = [testTeam, ...teamData].map((team) => {
    const [teamInfo, captainInfo, members] = team;
    const sportTypes: MemberSportTypes = [
      ...new Set(members.flatMap((member) => member[2])),
    ];
    const gender: Gender = calculateGender(
      members.map((member) => member[0].gender),
    );
    const weights = members
      .map((member) => member[1].weight)
      .sort((a, b) => +a - +b);
    const ages = members
      .map((member) => calculateAge(member[0].birthdate))
      .sort((a, b) => +a - +b);
    const location = `${team[0].city}, ${Region[team[0].region]}, ${Country[team[0].country]}`;

    return {
      ...teamInfo,
      captain: captainInfo,
      sportTypes,
      gender,
      weights,
      ages,
      location,
    };
  });

  return (
    <Container>
      <TeamsListing teams={teams} lang={lang} dictionary={dictionary} />
    </Container>
  );
}
