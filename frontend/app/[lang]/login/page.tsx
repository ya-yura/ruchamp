'use client';

import { Button, Spinner, Subtitle2Stronger } from '@fluentui/react-components';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { loginFields } from './constants';
import { TypeLoginFields } from '../../../lib/definitions';
import { useDictionary } from '../dictionary-provider';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm } from '@/lib/hooks/useForm';
import { auth } from '@/lib/client-api/auth';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { page } = useDictionary();
  const { values, handleChange } = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  async function handleSignIn(): Promise<void> {
    setIsLoading(true);
    setErrorMessage('');
    auth
      .login(
        values.username as keyof TypeLoginFields,
        values.password as keyof TypeLoginFields,
        false,
        callbackUrl,
      )
      .then(() => router.push('/dashboard'))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleSignIn();
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-1/2 max-w-[500px] flex-col justify-evenly rounded-md bg-slate-500 px-20 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="relative mb-6 flex h-auto w-full flex-col items-center justify-start gap-4 pb-8 pt-6"
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
                }}
                inputProps={{
                  type,
                  placeholder,
                  onChange: handleChange,
                  value:
                    (values[name as keyof TypeLoginFields] as string) || '',
                  name,
                }}
              />
            );
          })}
          {errorMessage && (
            <p className="absolute bottom-0">
              <ErrorCircle20Regular
                aria-label={errorMessage}
                primaryFill="rgb(248 113 113)"
              />{' '}
              <span className="text-red-400">{errorMessage}</span>
            </p>
          )}
        </fieldset>
        <div className="ml-auto mr-auto">
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
    </main>
  );
}
