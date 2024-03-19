'use client';

import { signOut, useSession } from 'next-auth/react';
import { ButtonWithLink } from '../custom-buttons';
import { Locale } from '@/i18n.config';
import { useDictionary } from '../../dictionary-provider';
import { Button } from '@fluentui/react-components';

export function AuthButtons({ lang }: { lang: Locale }) {
  const { data: session } = useSession();
  const { header } = useDictionary();

  async function handleLogout() {
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
  }

  if (session) {
    return (
      <li>
        <Button onClick={handleLogout} appearance="primary" size="medium">
          {header.buttons.logout}
        </Button>
      </li>
    );
  }

  return (
    <>
      <li>
        <ButtonWithLink
          lang={lang}
          href="/login"
          appearance="primary"
          size="medium"
        >
          {header.buttons.login}
        </ButtonWithLink>
      </li>
      <li>
        <ButtonWithLink
          lang={lang}
          href="/register"
          appearance="secondary"
          size="medium"
        >
          {header.buttons.createAccount}
        </ButtonWithLink>
      </li>
    </>
  );
}
