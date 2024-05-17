import { Container } from '@/components/container';
import { PageWithInfo } from '@/components/page-with-info';
import React from 'react';
import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Results } from './results';
import { getSession, getTeam } from '@/lib/actions';
import { TeamActionButtons } from './team-action-buttons';

export enum TeamTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Матчи',
  'results' = 'Результаты',
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const id = params.id;
  const team: any = await getTeam(id, session.token); //fix "any"

  const tabsContent: Record<TeamTabs, React.ReactNode> = {
    [TeamTabs['info']]: <Info />,
    [TeamTabs['athletes']]: <Athletes />,
    [TeamTabs['matches']]: <Matches />,
    [TeamTabs['results']]: <Results />,
  };

  return (
    <Container>
      <PageWithInfo<TeamTabs>
        id={team.Team.region}
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
