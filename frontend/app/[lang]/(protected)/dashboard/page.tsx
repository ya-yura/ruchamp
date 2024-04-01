'use client';

import { getUserData } from '@/lib/actions';
import { useUserStore } from '@/lib/store/user';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const getUser = useUserStore((state) => state.getUser);

  // Still don't know if it's needed
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (session?.user?.name && status === 'authenticated') {
      const token = session.user?.name;
      localStorage.setItem('jwt', token);
      getUser(token);
      getUserData(token);
    }
  }, [session, status]);

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <p>This is Dashboard</p>
    </main>
  );
}
