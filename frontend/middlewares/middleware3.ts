import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './chain';
import { updateSession } from '@/lib/actions';

export function withUpdateSessionMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    await updateSession(request);
    return await middleware(request, event, response);
  };
}
