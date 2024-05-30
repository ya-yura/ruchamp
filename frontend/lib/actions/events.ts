'use server';

import { EventMatch } from '@/app/[lang]/(unprotected)/event/[id]/page';
import { Event } from '../definitions';
import { checkResponse } from '../utils/other-utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getEvents(): Promise<Event[]> {
  return fetch(`${baseUrl}/event/events`, {}).then(checkResponse);
}

export async function getEvent(id: string): Promise<Event> {
  return fetch(`${baseUrl}/event/${id}`, {})
    .then(checkResponse)
    .then((res) => res[0]);
}

export async function getEventMatches(id: string): Promise<EventMatch[]> {
  return fetch(`${baseUrl}/event/${id}/matches`, {}).then(checkResponse);
}
