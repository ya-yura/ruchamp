// withUpdateSessionMiddleware should be the last because it returns not a middleware
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { CustomMiddleware } from './chain';
import { updateSession } from '@/lib/actions/auth';

export function withUpdateSessionMiddleware(): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse<unknown>,
  ) => {
    const updatedResponse = await updateSession(request);

    if (updatedResponse) {
      return updatedResponse;
    }

    return response;
  };
}
