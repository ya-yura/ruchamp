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
import { filterDuplicates } from '@/lib/utils';

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
      sirname: 'Абрамов',
      name: 'Аверьян',
      fathername: 'Платон',
      birthdate: '2011-09-27',
      gender: false,
      height: 187,
      weight: 128.0,
      image_field: 'https://picsum.photos/993/329',
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
      id: 9999,
      sirname: 'Парамонов',
      name: 'Сергей',
      fathername: 'Италианович',
      birthdate: '1995-09-27',
      gender: true,
      height: 187,
      weight: 98.0,
      image_field: 'https://picsum.photos/993/329',
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
  ],
};

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

  const tabsContent: Record<TeamTabs, React.ReactNode> = {
    [TeamTabs['info']]: (
      <InfoTeam teamInfo={teamInfo} captain={captain} coaches={coaches} />
    ),
    [TeamTabs['athletes']]: <AthletesTeam />,
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
