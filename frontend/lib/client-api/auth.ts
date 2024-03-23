import { signIn } from 'next-auth/react';
import {
  TypeHttpRequest,
  TypeLoginFields,
  TypeRegisterFields,
  TypeUser,
} from '../definitions';

// Проверяю ответ сервера
function checkResponse(res: any) {
  return res.ok
    ? res.json()
    : Promise.reject(`Request error. Status: ${res.status}`);
}

class Auth {
  private baseUrl: string;
  private headers: { [header: string]: string };

  constructor({ baseUrl, headers }: TypeHttpRequest) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  // Вход на сайт
  async login(
    username: keyof TypeLoginFields,
    password: keyof TypeLoginFields,
    redirect: boolean,
    callbackUrl: string,
  ): Promise<void> {
    const res = await signIn('credentials', {
      username,
      password,
      redirect,
      callbackUrl,
    });
    if (res && !res.error) {
    } else {
      throw new Error('Введённые не верные данные');
    }
  }

  // Регистрация пользователя
  register(user: Partial<TypeRegisterFields>): Promise<void> {
    const otherValues: Partial<TypeRegisterFields> = {
      is_active: false,
      is_superuser: false,
      is_verified: false,
    };
    return fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ ...user, ...otherValues }),
      headers: this.headers,
    }).then(checkResponse);
  }

  // Получение информации о текущем пользователе
  getCurrentUser(token: string): Promise<TypeUser> {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
}

export const auth = new Auth({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: { 'Content-Type': '', Authorization: '' },
});
