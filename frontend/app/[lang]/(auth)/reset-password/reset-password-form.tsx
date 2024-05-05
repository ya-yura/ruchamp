'use client';

import {
  Button,
  Caption1,
  FieldProps,
  Spinner,
} from '@fluentui/react-components';
import { CustomLink } from '../../../../components/custom-link';
import { CustomFieldset } from '../../../../components/forms/custom-fieldset';
import { CustomForm } from '../../../../components/forms/custom-form';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { useState } from 'react';
import { useForm } from '@/lib/hooks/useForm';
import { resetPasswordFields } from './constants';
import { Locale } from '@/i18n.config';
import { comparePasswords } from '@/lib/utils';

export function ResetPasswordForm({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { values, touched, handleChange } = useForm();
  const [passwordState, setPasswordState] = useState<{
    state: FieldProps['validationState'];
    message: string;
  }>({
    state: 'none',
    message: '',
  });

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
    <CustomForm onSubmit={handleSubmit}>
      <CustomFieldset
        isLoading={isLoading}
        fields={resetPasswordFields}
        onChange={handleChange}
        onBlur={() => comparePasswords(values, touched, setPasswordState)}
        values={values}
        passwordState={passwordState}
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
          <p className="mb-3">
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
          disabled={isLoading || passwordState.state !== 'success'}
        >
          {isLoading && <Spinner size="tiny" label="" />} Сохранить
        </Button>
      </div>
    </CustomForm>
  );
}
