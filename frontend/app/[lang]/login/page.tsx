'use client';

import { Button, Subtitle2Stronger, Title1 } from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { useState } from 'react';
import { loginFields } from './constants';
import { TypeLoginFields } from '../../../lib/definitions';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [values, setValues] = useState<TypeLoginFields>({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<
    'error' | 'success' | 'warning' | 'none'
  >('none');
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new URLSearchParams(values);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const name = e.target.name as keyof TypeLoginFields;
    const value = e.target.value;

    setValues((prevValues) => ({
      ...prevValues,
      [name as keyof TypeLoginFields]: value,
    }));
  }

  return (
    <main className="min-h-[calc(100vh-112px)] flex flex-col justify-start items-center py-11">
      <Title1 align="center">Это страница входа на сайт</Title1>

      <form
        className="mt-8 px-24 py-6 w-1/2 max-w-[500px] bg-slate-500 rounded-md flex flex-col justify-evenly"
        onSubmit={handleSubmit}
      >
        <fieldset className="flex flex-col justify-start items-center gap-4 h-60 pt-6 w-full">
          <legend className="text-center">
            <Subtitle2Stronger>Введите данные для входа</Subtitle2Stronger>
          </legend>
          {loginFields.map((item, index) => {
            const { label, type, placeholder, name } = item;
            console.log(values)
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
          Вход
        </Button>
      </form>
    </main>
  );
}
