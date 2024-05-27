import { TeamByIdFromServer } from '@/app/[lang]/(protected)/team/[id]/page';
import { HttpRequest } from '../definitions';
import { checkResponse } from './auth';
import { TeamDataFromServer } from '@/app/[lang]/(unprotected)/teams/page';

class TeamsApi {
  private baseUrl: string;
  private headers: { [header: string]: string };

  constructor({ baseUrl, headers }: HttpRequest) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getTeams(): Promise<Array<TeamDataFromServer>> {
    return fetch(`${this.baseUrl}/team/get-all-teams`).then(checkResponse);
  }

  getTeam(id: string, token: string): Promise<TeamByIdFromServer> {
    return fetch(`${this.baseUrl}/team/get-team/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(checkResponse)
      .catch((err) => {
        console.log('getTeam error', err);
      });
  }

  getTeamMatches(id: string) {
    return fetch(`${this.baseUrl}/team/${id}/matches`, {})
      .then(checkResponse)
      .catch((err) => {
        console.log('getTeamMatches error', err);
      });
  }
}

export const teamsApi = new TeamsApi({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: { 'Content-Type': '', Authorization: '' },
});
