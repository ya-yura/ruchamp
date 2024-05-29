import { checkResponse } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTeams() {
  return fetch(`${baseUrl}/team/get-all-teams`).then(checkResponse);
}

export async function getTeam(id: string) {
  return fetch(`${baseUrl}/team/get-team/${id}`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeam error', err);
    });
}

export async function getTeamMatches(id: string) {
  return fetch(`${baseUrl}/team/${id}/matches`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeamMatches error', err);
    });
}

export async function getTeamResults(id: string) {
  return fetch(`${baseUrl}/team/${id}/results`, {})
    .then(checkResponse)
    .catch((err) => {
      console.log('getTeamMatches error', err);
    });
}
