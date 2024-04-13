import { NextRequest } from 'next/server';
import { updateSession } from './lib/actions';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// This code is to chain i18n and auth middlewares

// import { chain } from '@/middlewares/chain';
// // import { withAuthMiddleware } from './middlewares/middleware1';
// import { withI18nMiddleware } from '@/middlewares/middleware2';
// import { withUpdateSessionMiddleware } from './middlewares/middleware3';

// export default chain([withUpdateSessionMiddleware, withI18nMiddleware]);

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };
