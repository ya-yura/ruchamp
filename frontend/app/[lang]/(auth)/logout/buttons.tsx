'use client';

import { auth } from '@/lib/api/auth';
import { Button } from '@fluentui/react-components';
// import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// export function LogoutButtons({ token }: { token: string }) {
export function LogoutButtons() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoading(true);
    // signOut({
    //   callbackUrl: '/',
    // });

    const token = localStorage.getItem('jwt');
    if (typeof token === 'string') {
      auth
        .logOut(token)
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
    localStorage.clear();
    router.push('/');
  }

  return (
    <div className="flex gap-5">
      <Button onClick={handleLogout} appearance="primary" size="large">
        Да
      </Button>
      <Button onClick={() => router.back()} appearance="secondary" size="large">
        Нет
      </Button>
    </div>
  );
}
