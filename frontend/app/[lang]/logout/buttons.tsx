'use client';

import { logout } from '@/lib/actions';
import { auth } from '@/lib/api/auth';
import { Button } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export function LogoutButtons({ token }: { token: string }) {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, dispatch] = useFormState(logout, undefined);
  const router = useRouter();

  // async function handleLogout() {
  //   setIsLoading(true);
  //   logout();
  //   auth
  //     .logOut(token)
  //     .catch((err) => console.log(err))
  //     .finally(() => setIsLoading(false));
  //   router.push('/ru');
  // }

  return (
    // <form className="flex gap-5" action={dispatch}>
    //   <Button type="submit">Выйти</Button>
    // </form>
    <form className="flex gap-5" action={dispatch}>
      <Button
        type="submit"
        appearance="primary"
        size="large"
      >
        Да
      </Button>
      <Button onClick={() => router.back()} appearance="secondary" size="large">
        Нет
      </Button>
    </form>
  );
}
