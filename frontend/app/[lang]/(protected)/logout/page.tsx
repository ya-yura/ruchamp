'use client';

import { Button, Title1 } from '@fluentui/react-components';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  async function handleLogout() {
    // setIsLoading(true);
    signOut({
      callbackUrl: '/',
    });
    const token = localStorage.getItem('jwt');
    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${token}`,
    };

    const res = await fetch('http://127.0.0.1:8000/auth/jwt/logout', {
      method: 'POST',
      headers: headers,
    });
    localStorage.clear();
    // setIsLoading(false);
  }
  return (
    <main className="mx-auto flex w-80 flex-col items-center justify-start gap-12">
      <Title1 align="center">Уверены, что хотите выйти?</Title1>
      <div className="flex gap-5">
        <Button onClick={handleLogout} appearance="primary" size="large">
          Да
        </Button>
        <Button onClick={() => router.back()} appearance="primary" size="large">
          Нет
        </Button>
      </div>
    </main>
  );
}
