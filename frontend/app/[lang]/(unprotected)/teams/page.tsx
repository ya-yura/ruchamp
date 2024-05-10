import React from 'react';
import { Container } from '@/components/container';
import { TeamsListing } from './teams-listing';
import { getTeams } from '@/lib/actions';

interface TeamInfo {
  id?: number;
  name: string;
  description: string;
  slug: string;
  invite_link: string;
  image_field: string;
  country: string;
  city: string;
  region: string;
}

interface CaptainInfo {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
}

export default async function Teams() {
  const res = await getTeams();
  const teamsRaw = res.Teams;
  const teams = teamsRaw.map((team: [TeamInfo, CaptainInfo], index: number) => {
    const teamInfo = team[0];
    const captainInfo = team[1];
    return {
      ...teamInfo,
      captain: captainInfo,
      id: teamInfo.id ? teamInfo.id : index, // remove this check later
    };
  });

  return (
    <Container>
      <TeamsListing teams={teams} />
    </Container>
  );
}
