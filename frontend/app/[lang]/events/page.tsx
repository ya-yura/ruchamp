import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUserData } from '@/lib/actions';
import { getServerSession } from 'next-auth';

export default async function Events() {
  // This route is not protected. So without token here will be an error
  // const session = await getServerSession(authOptions);
  // getUserData(session?.user?.name as string);

  return (
    <main className="min-h-[calc(100vh-112px)]">
      <h1 className="text-center">Это страница событий</h1>
    </main>
  );
}
