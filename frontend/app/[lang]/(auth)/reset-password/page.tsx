'use client';

import { Button, Caption1, Spinner } from '@fluentui/react-components';
import { useState } from 'react';
import { resetPasswordFields } from './constants';
import { useForm } from '@/lib/hooks/useForm';
import { Greetings } from '../../ui/greetings';
import { CustomLink } from '../../ui/custom-link';
import { Locale } from '@/i18n.config';
import { CustomForm } from '../../ui/forms/custom-form';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import { ErrorCircle20Regular } from '@fluentui/react-icons';

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
    console.log('reset password logic');
    setIsLoading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleSignIn();
  }

  return (
    <div className="relative flex h-full w-full">
      <Greetings
        title="Введите новый пароль"
        subtitle="Напечатайте новый пароль. Постарайтесь подобрать его посложнее. Он должен быть не короче 8 символов!"
      />
      <CustomForm onSubmit={handleSubmit}>
        <CustomFieldset
          isLoading={isLoading}
          fields={resetPasswordFields}
          onChange={handleChange}
          values={values}
        />
        <div className="flex items-center justify-between">
          <CustomLink
            className="transition-opacity duration-300 hover:opacity-70"
            href="/login"
            lang={lang}
          >
            <Caption1 as="p">Я вспомнил пароль</Caption1>
          </CustomLink>
          {errorMessage && (
            <p className="">
              <ErrorCircle20Regular
                aria-label={errorMessage}
                primaryFill="rgb(248 113 113)"
              />{' '}
              <span className="text-red-400">{errorMessage}</span>
            </p>
          )}
          <Button
            appearance="primary"
            size="large"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Spinner size="tiny" label="" />} Сохранить
          </Button>
        </div>
      </CustomForm>
    </div>
  );
}
