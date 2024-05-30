import { TypeRegFormSchema } from '@/app/[lang]/(auth)/register/register-form';
import { HttpRequest, UserData } from '../definitions';
import { checkResponse } from '../utils/other-utils';

class Auth {
  private baseUrl: string;
  private headers: { [header: string]: string };

  constructor({ baseUrl, headers }: HttpRequest) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async login(username: string, password: string): Promise<string | void> {
    const formData = new URLSearchParams({ username, password });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/jwt/login`,
        {
          method: 'POST',
          body: formData.toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      const user = await res.json();
      if (res.ok && user) {
        const { access_token } = user;
        return access_token;
      } else {
        console.log('Invalid credentials');
        throw new Error();
      }
    } catch (err) {
      console.log('Login error', err);
    }
  }

  register(values: TypeRegFormSchema): Promise<void> {
    return fetch(`${this.baseUrl}/users/create`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: this.headers,
    }).then(checkResponse);
  }

  getCurrentUser(token: string): Promise<UserData> {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(checkResponse)
      .catch((err) => {
        console.log('getCurrentUser error', err);
      });
  }

  getAthlete(token: string): Promise<any> {
    // fix any
    return fetch(`${this.baseUrl}/users/me/athlete`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(checkResponse)
      .catch((err) => {
        console.log('getAthlete error: ', err);
      });
  }

  logOut(token: string): Promise<void> {
    return fetch(`${this.baseUrl}/auth/jwt/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
}

export const auth = new Auth({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: { 'Content-Type': '', Authorization: '' },
});
