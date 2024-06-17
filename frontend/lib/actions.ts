'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateEvents() {
  revalidateTag('createEvent');
}

export async function revalidateEvent(id: number) {
  revalidateTag(`update-event-${id}`);
}
