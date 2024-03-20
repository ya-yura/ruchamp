'use client';

import {
  Button,
  Field,
  Radio,
  RadioGroup,
  Spinner,
  Subtitle2Stronger,
} from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { useDictionary } from '../dictionary-provider';
import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/router';
import { useForm } from '@/lib/hooks/useForm';
import { registerFields } from './constants';
import type { TypeRegisterFields } from '@/lib/definitions';
import { ErrorCircle20Regular } from '@fluentui/react-icons';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { page } = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  // const router = useRouter();

  const { values, handleChange } = useForm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const otherValues: Partial<TypeRegisterFields> = {
        is_active: false,
        is_superuser: false,
        is_verified: false,
        role_id: 1,
      };

      const res = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...values, ...otherValues }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Successful registration:', data);
      } else {
        console.error('Failed to register:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-2/3 max-w-[800px] flex-col justify-evenly rounded-md bg-slate-500 px-20 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="relative mb-6 grid h-auto w-full grid-cols-2 gap-x-11 gap-y-5 pb-8 pt-6"
          disabled={isLoading}
        >
          <legend className="text-center">
            <Subtitle2Stronger>{page.register.subtitle}</Subtitle2Stronger>
          </legend>
          {registerFields.map((item, index) => {
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
                  value: values[name as keyof TypeRegisterFields] || '',
                  name,
                }}
              />
            );
          })}
          <Field label="Пол" required size="large">
            <RadioGroup layout="horizontal">
              <Radio value="male" label="Мужской" />
              <Radio value="female" label="Женский" />
            </RadioGroup>
          </Field>
          {/* {errorMessage && (
          <p>
            <ErrorCircle20Regular
              aria-label={errorMessage}
              primaryFill="rgb(248 113 113)"
            />{' '}
            <span className="text-red-400">{errorMessage}</span>
          </p>
        )} */}
        </fieldset>
        <div className="ml-auto mr-auto">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Spinner size="tiny" label="" />}{' '}
            {page.register.register}
          </Button>
        </div>
      </form>
    </main>
  );
}
