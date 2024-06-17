'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateEvents() {
  revalidateTag('events');
}

export async function revalidateEvent(id: number) {
  revalidateTag(`update-event-${id}`);
}
