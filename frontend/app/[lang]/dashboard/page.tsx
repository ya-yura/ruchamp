'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.name && status === 'authenticated') {
        const token = session.user?.name;
        localStorage.setItem('jwt', token);

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: `Bearer ${token}`,
        };

        try {
          const res = await fetch('http://127.0.0.1:8000/users/users/me', {
            headers: headers,
          });

          if (res.ok) {
            const data = await res.json();
            console.log('Data:', data);
          } else {
            console.error('Failed to fetch data:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [session, status]);

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <p>This is Dashboard</p>
    </main>
  );
}
