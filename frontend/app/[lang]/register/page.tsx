'use client';

import {
  Button,
  Input,
  Field,
  Subtitle2Stronger,
  Title1,
} from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<
    'error' | 'success' | 'warning' | 'none'
  >('none');
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      setLoginError('none');
      setLoginErrorMessage('');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error during fetch:', error);
      setLoginError('error');
      setLoginErrorMessage('Не верный e-mail и/или пароль');
    }
  }

  return (
    <main className="min-h-[calc(100vh-112px)] flex flex-col justify-start items-center py-11">
      <Title1 align="center">Это страница регистрации</Title1>

      <form
        className="mt-8 px-24 py-6 w-1/2 max-w-[500px] bg-slate-500 rounded-md flex flex-col justify-evenly"
        onSubmit={handleSubmit}
      >
        <fieldset className="flex flex-col justify-start items-center gap-4 h-60 pt-6 w-full">
          <legend className="text-center">
            <Subtitle2Stronger>Введите данные для регистрации</Subtitle2Stronger>
          </legend>
          <Field
            as="div"
            required
            label="Почта"
            size="large"
            validationState={loginError}
          >
            <Input
              as="input"
              type="email"
              placeholder="Введите почту"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Field>
          <Field
            as="div"
            required
            label="Пароль"
            size="large"
            validationState={loginError}
            validationMessage={loginErrorMessage}
          >
            <Input
              as="input"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Field>
        </fieldset>
        <Button appearance="primary" size="large" type="submit">
          Регистрация
        </Button>
      </form>
    </main>
  );
}
