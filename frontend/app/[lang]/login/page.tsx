'use client';

import {
  Button,
  FieldProps,
  Spinner,
  Subtitle2Stronger,
} from '@fluentui/react-components';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { loginFields } from './constants';
import { TypeLoginFields } from '../../../lib/definitions';
import { Locale } from '@/i18n.config';
import { useDictionary } from '../dictionary-provider';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from '@/lib/hooks/useForm';

export default function Login({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { page } = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();

  const { values, handleChange } = useForm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
      callbackUrl,
    });
    if (res && !res.error) {
      router.push('/dashboard');
      setErrorMessage('');
      setIsLoading(false);
    } else {
      console.error('Error during fetch');
      setErrorMessage(page.login.loginError);
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-1/2 max-w-[500px] flex-col justify-evenly rounded-md bg-slate-500 px-24 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="flex h-64 w-full flex-col items-center justify-start gap-4 pt-6"
          disabled={isLoading}
        >
          <legend className="text-center">
            <Subtitle2Stronger>{page.login.subtitle}</Subtitle2Stronger>
          </legend>
          {loginFields.map((item, index) => {
            const { label, type, placeholder, name } = item;
            return (
              <InputField
                key={index}
                fieldProps={{
                  label,
                  // validationState: errors[name as keyof TypeLoginFields]
                  //   ? 'error'
                  //   : 'none',
                  // validationMessage: errors[name as keyof TypeLoginFields],
                }}
                inputProps={{
                  type,
                  placeholder,
                  onChange: handleChange,
                  value: values[name as keyof TypeLoginFields] || '',
                  name,
                }}
              />
            );
          })}
          {errorMessage && (
            <p>
              <ErrorCircle20Regular
                aria-label={errorMessage}
                primaryFill="rgb(248 113 113)"
              />{' '}
              <span className="text-red-400">{errorMessage}</span>
            </p>
          )}
        </fieldset>
        <Button
          appearance="primary"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Spinner size="tiny" label="" />} {page.login.enter}
        </Button>
      </form>
    </main>
  );
}
