'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateEvents() {
  revalidateTag('events');
}

export async function revalidateEvent(id: number | string) {
  revalidateTag(`update-event-${id}`);
}

export async function revalidateTeams() {
  revalidateTag('teams');
}

export async function revalidateUser() {
  revalidateTag('user');
}
