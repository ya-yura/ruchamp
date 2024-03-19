'use client';

import {
  Button,
  Input,
  Field,
  Subtitle2Stronger,
  Title1,
  FieldProps,
} from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { loginFields } from '../login/constants';
import { useDictionary } from '../dictionary-provider';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function Register() {
  const [values, setValues] = useState<TypeLoginFields>({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] =
    useState<FieldProps['validationState']>('none');
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { page } = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        <Button
          appearance="primary"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="extra-tiny" label="" />
          ) : (
            page.login.enter
          )}
        </Button>
      </form>
    </main>
  );
}
