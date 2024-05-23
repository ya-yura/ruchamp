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

export interface ValueOption {
  value: string | number[];
  displayedValue: string;
}

export interface FilterData {
  id: string;
  title: string;
  type?: 'value' | 'range';
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
  coaches: Coach[];
}

interface TeamByIdFromServer {
  Team: TeamInfo;
  Captain: CaptainId;
  Members: TeamMember[];
}

const testTeam: TeamByIdFromServer = {
  Team: {
    id: 99999,
    name: 'Соболева Лтд',
    image_field: 'https://dummyimage.com/164x520',
    description: 'Грудь встать отдел опасность постоянный угодный страсть.',
    invite_link: 'ad1e7767-ee4c-4eaf-8f51-4f0e4dd687ad',
    slug: '',
    country: 3,
    city: 'ст. Кош-Агач',
    region: 18,
  },
  Captain: {
    user_id: 322,
  },
  Members: [
    {
      id: 322,
      sirname: 'Абрамова',
      name: 'Алефтина',
      fathername: 'Платоновна',
      birthdate: '2011-09-27',
      gender: false,
      height: 187,
      weight: 128.0,
      image_field: 'https://picsum.photos/993/340',
      country: 3,
      region: 12,
      city: 'клх Тобольск',
      sport_types: ['Самбо', 'Греко-римская борьба'],
      coaches: [
        {
          sirname: 'Шарапова',
          name: 'Ладимир',
          fathername: 'Лариса',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушев',
          name: 'Ферапонт',
          fathername: 'Ян',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 10000,
      sirname: 'Парамонов',
      name: 'Сергей',
      fathername: 'Италианович',
      birthdate: '1995-09-27',
      gender: true,
      height: 187,
      weight: 98.0,
      image_field: 'https://picsum.photos/993/222',
      country: 1,
      region: 1,
      city: 'Химки',
      sport_types: ['Самбо', 'Айкидо', 'Бокс'],
      coaches: [
        {
          sirname: 'Шарапова',
          name: 'Ладимир',
          fathername: 'Лариса',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушев',
          name: 'Ферапонт',
          fathername: 'Ян',
          qualification_level: 2,
        },
        {
          sirname: 'Фалалеев',
          name: 'Дмитрий',
          fathername: 'Сергеевич',
          qualification_level: 1,
        },
      ],
    },
    {
      id: 10001,
      sirname: 'Филимонов',
      name: 'Анатолий',
      fathername: 'Валерианович',
      birthdate: '1995-01-27',
      gender: true,
      height: 185,
      weight: 81.0,
      image_field: 'https://picsum.photos/993/221',
      country: 1,
      region: 10,
      city: 'Бокситогорск',
      sport_types: ['Тхэквондо', 'Айкидо', 'Кайдо'],
      coaches: [
        {
          sirname: 'Басов',
          name: 'Ладимир',
          fathername: 'Баристович',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушева',
          name: 'Филия',
          fathername: 'Яновна',
          qualification_level: 2,
        },
        {
          sirname: 'Фалалеев',
          name: 'Дмитрий',
          fathername: 'Сергеевич',
          qualification_level: 1,
        },
      ],
    },
    {
      id: 450,
      sirname: 'Иванова',
      name: 'Екатерина',
      fathername: 'Александровна',
      birthdate: '2003-03-15',
      gender: false,
      height: 172,
      weight: 60.5,
      image_field: 'https://picsum.photos/993/345',
      country: 2,
      region: 5,
      city: 'Москва',
      sport_types: ['Теннис', 'Баскетбол'],
      coaches: [
        {
          sirname: 'Смирнов',
          name: 'Владимир',
          fathername: 'Игоревич',
          qualification_level: 3,
        },
        {
          sirname: 'Петрова',
          name: 'Мария',
          fathername: 'Викторовна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 678,
      sirname: 'Кузнецов',
      name: 'Алексей',
      fathername: 'Борисович',
      birthdate: '1998-07-21',
      gender: true,
      height: 180,
      weight: 75.0,
      image_field: 'https://picsum.photos/993/346',
      country: 3,
      region: 8,
      city: 'Новосибирск',
      sport_types: ['Волейбол', 'Легкая атлетика'],
      coaches: [
        {
          sirname: 'Иванов',
          name: 'Сергей',
          fathername: 'Николаевич',
          qualification_level: 1,
        },
        {
          sirname: 'Алексеева',
          name: 'Ольга',
          fathername: 'Петровна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 893,
      sirname: 'Сидоров',
      name: 'Дмитрий',
      fathername: 'Евгеньевич',
      birthdate: '2000-05-18',
      gender: true,
      height: 190,
      weight: 85.0,
      image_field: 'https://picsum.photos/993/347',
      country: 1,
      region: 3,
      city: 'Санкт-Петербург',
      sport_types: ['Футбол', 'Тяжелая атлетика'],
      coaches: [
        {
          sirname: 'Кузнецова',
          name: 'Анна',
          fathername: 'Васильевна',
          qualification_level: 1,
        },
        {
          sirname: 'Павлов',
          name: 'Артем',
          fathername: 'Дмитриевич',
          qualification_level: 3,
        },
      ],
    },
    {
      id: 1501,
      sirname: 'Зайцева',
      name: 'Марина',
      fathername: 'Николаевна',
      birthdate: '2012-01-09',
      gender: false,
      height: 160,
      weight: 52.0,
      image_field: 'https://picsum.photos/993/348',
      country: 2,
      region: 10,
      city: 'Екатеринбург',
      sport_types: ['Гимнастика', 'Плавание'],
      coaches: [
        {
          sirname: 'Попов',
          name: 'Андрей',
          fathername: 'Иванович',
          qualification_level: 2,
        },
        {
          sirname: 'Беляева',
          name: 'Елена',
          fathername: 'Сергеевна',
          qualification_level: 3,
        },
      ],
    },
    {
      id: 2102,
      sirname: 'Волков',
      name: 'Николай',
      fathername: 'Владимирович',
      birthdate: '1993-11-05',
      gender: true,
      height: 185,
      weight: 55.0,
      image_field: 'https://picsum.photos/993/349',
      country: 1,
      region: 7,
      city: 'Казань',
      sport_types: ['Хоккей', 'Бокс'],
      coaches: [
        {
          sirname: 'Соловьев',
          name: 'Виктор',
          fathername: 'Алексеевич',
          qualification_level: 1,
        },
        {
          sirname: 'Федорова',
          name: 'Наталья',
          fathername: 'Михайловна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 21021212,
      sirname: 'Палкин',
      name: 'Парфён',
      fathername: 'Владимирович',
      birthdate: '1990-11-05',
      gender: true,
      height: 185,
      weight: 57.0,
      image_field: 'https://picsum.photos/993/351',
      country: 1,
      region: 7,
      city: 'Казань',
      sport_types: ['Хоккей', 'Бокс'],
      coaches: [
        {
          sirname: 'Соловьев',
          name: 'Виктор',
          fathername: 'Алексеевич',
          qualification_level: 1,
        },
        {
          sirname: 'Федорова',
          name: 'Наталья',
          fathername: 'Михайловна',
          qualification_level: 2,
        },
      ],
    },
  ],
};

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const id = params.id;
  const team: TeamByIdFromServer = await getTeam(id, session.token);
  const teamInfo = testTeam.Team;
  const members = testTeam.Members;
  const captainId = testTeam.Captain.user_id;
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
  const ages = members
    .map((member) => calculateAge(member.birthdate))
    .sort((a, b) => +a - +b);

  const genderFilterData: FilterData = {
    id: 'gender',
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
    id: 'weight',
    title: 'Вес, кг',
    type: 'range',
    options: rangesFromArray(weights, 5),
  };

  const gradeFilterData: FilterData = {
    id: 'grade',
    title: 'Уровень спортсмена',
    type: 'value',
    options: [
      {
        value: 'ms',
        displayedValue: 'Мастер Спорта',
      },
      {
        value: 'kms',
        displayedValue: 'Кандидат в Мастера Спорта',
      },
    ],
  };

  const ageFilterData: FilterData = {
    id: 'age',
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
