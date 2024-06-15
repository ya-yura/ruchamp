'use server';

import { revalidateTag } from 'next/cache';

export default async function revalidateEvents() {
  revalidateTag('createEvent');
}
