import { Event } from '../definitions';
import { checkResponse } from '../utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getEvents(): Promise<Array<Event>> {
  return fetch(`${baseUrl}/event/events`, {}).then(checkResponse);
}

export async function getEvent(id: string): Promise<Event> {
  return fetch(`${baseUrl}/event/${id}`, {})
    .then(checkResponse)
    .then((res) => res[0]);
}
