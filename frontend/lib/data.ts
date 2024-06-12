import { Event } from './definitions';
import { TeamDataFromServer } from '@/app/[lang]/(unprotected)/teams/page';
import {
  TeamByIdFromServer,
  TeamMatch,
  TeamMemberWithResults,
} from '@/app/[lang]/(unprotected)/team/[id]/page';
import { revalidatePath } from 'next/cache';
import { EventResult } from '@/app/[lang]/(unprotected)/event/[id]/results/page';
import { GridData } from '@/app/[lang]/(unprotected)/event/[id]/matches/[matchId]/page';
import { EventMatch } from '@/app/[lang]/(unprotected)/event/[id]/matches/matches-event';
import { Participant } from '@/app/[lang]/(unprotected)/event/[id]/participants/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Sport types

export async function fetchSportTypes(): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/event/sports`, {
      // cache: 'force-cache',
      next: { revalidate: 3600 },
    });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error('Error while fetching sport types:', error);
    throw new Error('Failed to fetch sport types.');
  }
}

// Events

export async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${baseUrl}/event/events`, {
      // cache: 'force-cache',
      next: { revalidate: 300 },
    });
    // revalidatePath('/events');
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error('Error while fetching events:', error);
    throw new Error('Failed to fetch events.');
  }
}

export async function fetchEvent(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`${baseUrl}/event/${id}`, {});
    const event = await res.json();
    return res.ok ? event[0] : null;
  } catch (error) {
    console.error(`Error while fetching event with id ${id}: `, error);
    throw new Error(`Failed to fetch event with id ${id}`);
  }
}

export async function fetchMatches(id: string): Promise<EventMatch[]> {
  try {
    const res = await fetch(`${baseUrl}/event/${id}/matches`, {});
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(
      `Error while fetching matches for event with id ${id}: `,
      error,
    );
    throw new Error(`Failed to fetch matches for event with id ${id}`);
  }
}

export async function fetchParticipants(id: string): Promise<Participant[]> {
  try {
    const res = await fetch(`${baseUrl}/matches/${id}/all-participants`, {});
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(
      `Error while fetching participants for event with id ${id}: `,
      error,
    );
    throw new Error(`Failed to fetch participants for event with id ${id}`);
  }
}

export async function fetchResults(id: string): Promise<EventResult[]> {
  try {
    const res = await fetch(`${baseUrl}/event/${id}/matches-results`, {});
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(`Error while fetching event results with id ${id}: `, error);
    throw new Error(`Failed to fetch event results with id ${id}`);
  }
}

export async function fetchTournamentGrid(id: string): Promise<GridData> {
  try {
    const res = await fetch(`${baseUrl}/matches/tournament-grid/${id}`, {});
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error(
      `Error while fetching tournament grid with id ${id}: `,
      error,
    );
    throw new Error(`Failed to fetch tournament grid with id ${id}`);
  }
}

// Teams

export async function fetchTeams(): Promise<TeamDataFromServer[]> {
  try {
    const res = await fetch(`${baseUrl}/team/get-all-teams`, {
      next: { revalidate: 300 },
    });
    // revalidatePath('/teams');
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(`Error while fetching teams: `, error);
    throw new Error(`Failed to fetch teams`);
  }
}

export async function fetchTeam(id: string): Promise<TeamByIdFromServer> {
  try {
    const res = await fetch(`${baseUrl}/team/get-team/${id}`, {});
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error(`Error while fetching team with id ${id}: `, error);
    throw new Error(`Failed to fetch team with id ${id}`);
  }
}

export async function fetchTeamMatches(id: string): Promise<TeamMatch[]> {
  try {
    const res = await fetch(`${baseUrl}/team/${id}/matches`, {});
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(`Error while fetching team matches with id ${id}: `, error);
    throw new Error(`Failed to fetch team matches with id ${id}`);
  }
}

export async function fetchTeamResults(
  id: string,
): Promise<TeamMemberWithResults[]> {
  try {
    const res = await fetch(`${baseUrl}/team/${id}/results`, {});
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error(`Error while fetching team results with id ${id}: `, error);
    throw new Error(`Failed to fetch team results with id ${id}`);
  }
}

// For Orgs

export async function fetchOrgEvents(
  token: string | undefined,
): Promise<Event[]> {
  if (!token) {
    console.error('Something wrong with token');
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/users/me/organizer`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      // cache: 'force-cache',
      next: { revalidate: 300 },
    });
    // revalidatePath('/events');
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error while fetching org's events: ", error);
    throw new Error("Failed to fetch org's events.");
  }
}
