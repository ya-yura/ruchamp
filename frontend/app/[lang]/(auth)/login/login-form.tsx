'use client';

import {
  Button,
  Caption1,
  SelectTabData,
  SelectTabEvent,
  Spinner,
  TabValue,
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { loginFields } from './constants';
import { useDictionary } from '../../dictionary-provider';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AuthSwitcher } from '../../ui/auth/auth-switcher';
import { CustomLink } from '../../ui/custom-link';
import { Locale } from '@/i18n.config';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { useFormState } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { useForm } from '@/lib/hooks/useForm';

export function LoginForm({ lang }: { lang: Locale }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { page } = useDictionary();
  const { values, handleChange } = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [selectedValue, setSelectedValue] = useState<TabValue>('login');

  useEffect(() => {
    if (selectedValue === 'login') {
      router.push(`/${lang}/login`);
    } else {
      router.push(`/${lang}/register`);
    }
  }, [selectedValue]);

  function onTabSelect(event: SelectTabEvent, data: SelectTabData) {
    setSelectedValue(data.value);
  }

  return (
    <form
      className="relative my-auto flex h-fit w-auto flex-col justify-evenly rounded-md bg-white px-9 py-7"
      action={dispatch}
    >
      <div className="mb-6 flex w-auto items-center justify-center">
        <AuthSwitcher selectedValue={selectedValue} onTabSelect={onTabSelect} />
      </div>
      <CustomFieldset
        isLoading={isLoading}
        fields={loginFields}
        onChange={handleChange}
        values={values}
      />
      {errorMessage && (
        <p className="mb-3">
          <ErrorCircle20Regular
            aria-label={errorMessage}
            primaryFill="rgb(248 113 113)"
          />{' '}
          <span className="text-red-400">{errorMessage}</span>
        </p>
      )}
      <div className="flex items-center justify-between">
        <CustomLink
          className="transition-opacity duration-300 hover:opacity-70"
          href="/forgot-password"
          lang={lang}
        >
          <Caption1 as="p">Я забыл пароль</Caption1>
        </CustomLink>
        <Button
          appearance="primary"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Spinner size="tiny" label="" />} {page.login.enter}
        </Button>
      </div>
    </form>
  );
}
