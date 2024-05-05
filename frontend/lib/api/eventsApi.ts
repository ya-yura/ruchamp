import { TypeEvent, TypeHttpRequest } from '../definitions';
import { checkResponse } from './auth';

class EventsApi {
  private baseUrl: string;
  private headers: { [header: string]: string };

  constructor({ baseUrl, headers }: TypeHttpRequest) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getEvents(): Promise<Array<TypeEvent>> {
    return fetch(`${this.baseUrl}/event/events`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(checkResponse);
  }

  getEvent(id: string): Promise<TypeEvent> {
    return fetch(`${this.baseUrl}/event/${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(checkResponse);
  }
}

export const eventsApi = new EventsApi({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: { 'Content-Type': '', Authorization: '' },
});
