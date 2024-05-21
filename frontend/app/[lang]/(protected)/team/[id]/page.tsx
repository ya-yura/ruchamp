import { Container } from '@/components/container';
import { PageWithInfo } from '@/components/page-with-info';
import React from 'react';
import { getSession, getTeam } from '@/lib/actions';
import { TeamActionButtons } from './team-action-buttons';
import { TeamTabs } from '@/lib/definitions';
import { InfoTeam } from './info-team';
import { AthletesTeam } from './athletes-team';
import { MatchesTeam } from './matches-team';
import { ResultsTeam } from './results-team';

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

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const id = params.id;
  const team: TeamByIdFromServer = await getTeam(id, session.token);
  const teamInfo = team.Team;
  const captain = team.Captain;
  const coaches = [...new Set(team.Members.map((member) => member[3]))];

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
        bages={['Убрать', 'Этот', 'Хардкод']}
        buttons={<TeamActionButtons />}
        tabsContent={tabsContent}
        tabsObj={TeamTabs}
      />
    </Container>
  );
}
