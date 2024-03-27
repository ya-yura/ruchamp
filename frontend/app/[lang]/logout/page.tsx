'use client';

import { Button, Title1 } from '@fluentui/react-components';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  return (
    <main className="mx-auto flex w-80 flex-col items-center justify-start gap-12">
      <Title1 align="center">Уверены, что хотите выйти?</Title1>
      <Button
        onClick={() => signOut({ callbackUrl: '/' })}
        appearance="primary"
        size="large"
      >
        Да
      </Button>
    </main>
  );
}
