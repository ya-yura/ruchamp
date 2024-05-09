import { Event, HttpRequest } from '../definitions';
import { checkResponse } from './auth';

class EventsApi {
  private baseUrl: string;
  private headers: { [header: string]: string };

  constructor({ baseUrl, headers }: HttpRequest) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getEvents(): Promise<Array<Event>> {
    return fetch(`${this.baseUrl}/event/events`, {}).then(checkResponse);
  }

  getEvent(id: string): Promise<Event> {
    return fetch(`${this.baseUrl}/event/${id}`, {}).then(checkResponse);
  }
}

export const eventsApi = new EventsApi({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: { 'Content-Type': '', Authorization: '' },
});
