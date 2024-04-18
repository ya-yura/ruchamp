'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './api/auth';
import { TypeRegisterFields } from './definitions';

const secretKey = 'secret'; // replace later
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('86400 sec from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await auth.register(formData);
    await auth.login(
      formData.get('email') as string,
      formData.get('password') as string,
    );
  } catch (err) {
    console.log('registerUser', err);
    return 'Ошибка регстрации. Данные введены неверно';
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  try {
    // const user = { email: 'users email', name: 'users name' };
    const token = await auth.login(username, password);
    if (token) {
      const user = await auth.getCurrentUser(token);
      // Create the session
      const expires = new Date(Date.now() + 10 * 1000);
      const session = await encrypt({ user, token, expires });
      // Save the session in a cookie
      cookies().set('session', session, { expires, httpOnly: true });
    } else throw new Error();
  } catch (error) {
    return 'Введены не верные данные';
  }
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 86400 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
