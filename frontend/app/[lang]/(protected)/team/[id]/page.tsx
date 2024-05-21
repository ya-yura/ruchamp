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

export interface TeamById {
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

export interface Captain {
  sirname: string;
  name: string;
  fathername: string;
}

interface MemberPersonalDetails {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
}

interface MemberPhysicalDetails {
  height: number;
  weight: number;
  image_field: string | null;
  country: number;
  city: string;
  region: number;
}

export interface CoachDetails {
  sirname: string;
  name: string;
  fathername: string;
  qualification_level: number;
}

type Member = [
  MemberPersonalDetails,
  MemberPhysicalDetails,
  string[],
  CoachDetails,
];

export interface TeamByIdFromServer {
  Team: TeamById;
  Captain: Captain;
  Members: Member[];
}

const testTeam: TeamByIdFromServer = {
  Team: {
    id: 98,
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
    sirname: 'Абрамов',
    name: 'Аверьян',
    fathername: 'Платон',
  },
  Members: [
    [
      {
        id: 322,
        sirname: 'Абрамов',
        name: 'Аверьян',
        fathername: 'Платон',
        birthdate: '2011-09-27',
        gender: false,
      },
      {
        height: 139,
        weight: 62.0,
        image_field: 'https://picsum.photos/202/22',
        country: 1,
        city: 'д. Майкоп',
        region: 20,
      },
      ['Самбо', 'Греко-римская борьба'],
      {
        sirname: 'Шарапова',
        name: 'Ладимир',
        fathername: 'Лариса',
        qualification_level: 1,
      },
    ],
    [
      {
        id: 213,
        sirname: 'Абрамов',
        name: 'Аверьян',
        fathername: 'Платон',
        birthdate: '2011-09-27',
        gender: false,
      },
      {
        height: 139,
        weight: 62.0,
        image_field: 'https://picsum.photos/202/22',
        country: 1,
        city: 'д. Майкоп',
        region: 20,
      },
      ['Самбо', 'Греко-римская борьба', 'test', 'test', 'test1'],
      {
        sirname: 'Шарапова',
        name: 'Ладимир',
        fathername: 'Лариса',
        qualification_level: 1,
      },
    ],
    [
      {
        id: 213,
        sirname: 'Абрамов',
        name: 'Аверьян',
        fathername: 'Платон',
        birthdate: '2011-09-27',
        gender: false,
      },
      {
        height: 139,
        weight: 62.0,
        image_field: 'https://picsum.photos/202/22',
        country: 1,
        city: 'д. Майкоп',
        region: 20,
      },
      ['Самбо', 'Греко-римская борьба', 'test', 'test', 'test1'],
      {
        sirname: 'Жеглов',
        name: 'Володя',
        fathername: 'Донатович',
        qualification_level: 2,
      },
    ],
  ],
};

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const id = params.id;
  const team: TeamByIdFromServer = await getTeam(id, session.token);
  const teamInfo = team.Team;
  const captain = team.Captain;
  const coaches = filterDuplicates<CoachDetails>(
    team.Members.map((member) => member[3]),
  );
  const sportTypes = [...new Set(team.Members.flatMap((member) => member[2]))];

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
