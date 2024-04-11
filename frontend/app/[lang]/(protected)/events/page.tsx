import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export default async function Events() {
  // const session = await getServerSession(authOptions);
  // getUserData(session?.user?.name as string);

  return (
    <main className="min-h-[calc(100vh-112px)]">
      <h1 className="text-center">Это страница событий</h1>
    </main>
  );
}
