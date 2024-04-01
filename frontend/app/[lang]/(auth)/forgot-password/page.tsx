'use client';

import { Button, Caption1, Spinner } from '@fluentui/react-components';
import { useState } from 'react';
import { forgotPasswordFields } from './constants';
import { useForm } from '@/lib/hooks/useForm';
import { Greetings } from '../../ui/greetings';
import { CustomLink } from '../../ui/custom-link';
import { Locale } from '@/i18n.config';
import { CustomForm } from '../../ui/forms/custom-form';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';

export default function Login({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { values, handleChange } = useForm();

  async function handleSignIn(): Promise<void> {
    setIsLoading(true);
    setErrorMessage('');
    console.log('forgot password logic');
    setIsLoading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleSignIn();
  }

  return (
    <div className="relative flex h-full w-full">
      <Greetings
        title="Восстановим пароль"
        subtitle="Ничего страшного, такое бывает. Сейчас всё исправим. Напомните свой адрес электронной почты."
      />
      <CustomForm onSubmit={handleSubmit}>
        <CustomFieldset
          isLoading={isLoading}
          fields={forgotPasswordFields}
          onChange={handleChange}
          values={values}
          errorMessage={errorMessage}
        />
        <div className="flex items-center justify-between">
          <CustomLink
            className="transition-opacity duration-300 hover:opacity-70"
            href="/login"
            lang={lang}
          >
            <Caption1 as="p">Я вспомнил пароль</Caption1>
          </CustomLink>
          <Button
            appearance="primary"
            size="large"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Spinner size="tiny" label="" />} Восстановить
          </Button>
        </div>
      </CustomForm>
    </div>
  );
}
