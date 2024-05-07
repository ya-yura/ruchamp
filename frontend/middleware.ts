import { chain } from '@/middlewares/chain';
import { withI18nMiddleware } from '@/middlewares/middleware1';
import { withUpdateSessionMiddleware } from './middlewares/middleware2';

// withUpdateSessionMiddleware should be the last
export default chain([withI18nMiddleware, withUpdateSessionMiddleware]);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
