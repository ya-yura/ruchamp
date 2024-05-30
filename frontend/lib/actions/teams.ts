'use server';

import { TeamDataFromServer } from '@/app/[lang]/(unprotected)/teams/page';
import {
  TeamByIdFromServer,
  TeamMatch,
  TeamMemberWithResults,
} from '@/app/[lang]/(unprotected)/team/[id]/page';
import { checkResponse } from '../utils/other-utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTeams(): Promise<TeamDataFromServer[]> {
  return fetch(`${baseUrl}/team/get-all-teams`).then(checkResponse);
}

export async function getTeam(id: string): Promise<TeamByIdFromServer> {
  return fetch(`${baseUrl}/team/get-team/${id}`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeam error', err);
    });
}

export async function getTeamMatches(id: string): Promise<TeamMatch[]> {
  return fetch(`${baseUrl}/team/${id}/matches`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeamMatches error', err);
    });
}

export async function getTeamResults(
  id: string,
): Promise<TeamMemberWithResults[]> {
  return fetch(`${baseUrl}/team/${id}/results`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeamMatches error', err);
    });
}
