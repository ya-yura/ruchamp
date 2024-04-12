// import { signIn, signOut } from 'next-auth/react';
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

  async login(
    username: keyof TypeLoginFields,
    password: keyof TypeLoginFields,
    redirect: boolean,
    callbackUrl?: string,
  ): Promise<string | void> {
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
      }
    } catch (err) {
      console.log('Login error', err);
    }

    // Логин через Next Auth
    // const res = await signIn('credentials', {
    //   username,
    //   password,
    //   redirect,
    //   callbackUrl,
    // });
    // if (res && !res.error) {
    // } else {
    //   throw new Error('Введены не верные данные');
    // }
  }

  register(user: Partial<TypeRegisterFields>): Promise<void> {
    const {
      repeat_password,
      athlete_weight,
      athlete_height,
      athlete_sport_type,
      spectator_phone_number,
      event_organizer_organization_name,
      event_organizer_organization_website,
      event_organizer_organization_contact_email,
      event_organizer_organization_contact_phone,
      referee_qualification_level,
      ...userCreate
    } = user;

    const userInfo = {
      athlete_weight,
      athlete_height,
      athlete_sport_type,
      spectator_phone_number,
      event_organizer_organization_name,
      event_organizer_organization_website,
      event_organizer_organization_contact_email,
      event_organizer_organization_contact_phone,
      referee_qualification_level,
    };

    // Remove undefined or null values from userInfo
    const filteredUserInfo = Object.fromEntries(
      Object.entries(userInfo).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    const user_data = {
      info: filteredUserInfo,
    };
    return fetch(`${this.baseUrl}/users/create`, {
      method: 'POST',
      body: JSON.stringify({ user_create: userCreate, user_data }),
      headers: this.headers,
    }).then(checkResponse);
  }

  getCurrentUser(token: string): Promise<TypeUser> {
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
