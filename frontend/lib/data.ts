import {
  EventMatch,
  Participant,
} from '@/app/[lang]/(unprotected)/event/[id]/page';
import { Event } from './definitions';
import { TeamDataFromServer } from '@/app/[lang]/(unprotected)/teams/page';
import {
  TeamByIdFromServer,
  TeamMatch,
  TeamMemberWithResults,
} from '@/app/[lang]/(unprotected)/team/[id]/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchEvents(): Promise<Event[]> {
  // noStore();
  try {
    const res = await fetch(`${baseUrl}/event/events`, {});
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

export async function fetchTeams(): Promise<TeamDataFromServer[]> {
  try {
    const res = await fetch(`${baseUrl}/team/get-all-teams`);
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