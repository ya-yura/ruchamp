'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.name && status === 'authenticated') {
      localStorage.setItem('jwt', session.user?.name);
      // document.cookie = `ruchamp=${session.user?.name}`
    }
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <p>This is Dashboard</p>
    </main>
  );
}
