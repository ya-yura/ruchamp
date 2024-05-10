import React from 'react';
import { Container } from '@/components/container';
import { TeamsListing } from './teams-listing';
import { getTeams } from '@/lib/actions';

export default async function Teams() {
  const teams = await getTeams();
  //   console.log('teams', teams);

  return (
    <Container>
      <TeamsListing teams={teams} />
    </Container>
  );
}
