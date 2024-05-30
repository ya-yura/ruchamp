'use server';

import { Participant } from '@/app/[lang]/(unprotected)/event/[id]/page';
import { checkResponse } from '../utils/other-utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getMatchesParticipants(
  id: string,
): Promise<Participant[]> {
  return fetch(`${baseUrl}/matches/${id}/all-participants`, {}).then(
    checkResponse,
  );
}
