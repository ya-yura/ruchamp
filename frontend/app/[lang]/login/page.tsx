'use client';

import {
  Button,
  FieldProps,
  Subtitle2Stronger,
} from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { loginFields } from './constants';
import { TypeLoginFields } from '../../../lib/definitions';
import { Locale } from '@/i18n.config';
import { useDictionary } from '../dictionary-provider';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login({ lang }: { lang: Locale }) {
  const [values, setValues] = useState<TypeLoginFields>({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] =
    useState<FieldProps['validationState']>('none');
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
  const { page } = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
      callbackUrl,
    });
    if (res && !res.error) {
      router.push('/dashboard');
      setLoginError('none');
      setLoginErrorMessage('');
    } else {
      console.error('Error during fetch');
      setLoginError('error');
      setLoginErrorMessage('Не верный e-mail и/или пароль');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const name = e.target.name as keyof TypeLoginFields;
    const value = e.target.value;

    setValues((prevValues) => ({
      ...prevValues,
      [name as keyof TypeLoginFields]: value,
    }));
    setLoginError('none');
    setLoginErrorMessage('');
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-1/2 max-w-[500px] flex-col justify-evenly rounded-md bg-slate-500 px-24 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset className="flex h-60 w-full flex-col items-center justify-start gap-4 pt-6">
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
                  validationState: loginError,
                  validationMessage: loginErrorMessage,
                }}
                inputProps={{
                  type,
                  placeholder,
                  onChange: handleChange,
                  value: values[`${name}` as keyof TypeLoginFields],
                  name,
                }}
              />
            );
          })}
        </fieldset>
        <Button appearance="primary" size="large" type="submit">
          {page.login.enter}
        </Button>
      </form>
    </main>
  );
}
