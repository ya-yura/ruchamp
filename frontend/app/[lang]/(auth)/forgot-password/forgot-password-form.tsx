'use client';

import { Button, Caption1, Spinner } from '@fluentui/react-components';
import { CustomLink } from '../../../../components/custom-link';
import { CustomFieldset } from '../../../../components/forms/custom-fieldset';
import { CustomForm } from '../../../../components/forms/custom-form';
import { useState } from 'react';
import { useForm } from '@/lib/hooks/useForm';
import { forgotPasswordFields } from './constants';
import { Locale } from '@/i18n.config';

export function ForgotPasswordForm({ lang }: { lang: Locale }) {
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
    <CustomForm onSubmit={handleSubmit}>
      <CustomFieldset
        isLoading={isLoading}
        fields={forgotPasswordFields}
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
  );
}
