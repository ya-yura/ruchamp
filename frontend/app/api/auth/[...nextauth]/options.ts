import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'Введите вашу почту и пароль',
      credentials: {
        username: {
          label: 'Почта',
          type: 'text',
          placeholder: 'Введите email',
          required: true,
        },
        password: {
          label: 'Пароль',
          type: 'password',
          placeholder: 'Введите пароль',
          required: true,
        },
      },
      async authorize(credentials) {
        const formData = new URLSearchParams(credentials);
        const res = await fetch('http://127.0.0.1:8000/auth/jwt/login', {
          method: 'POST',
          body: formData.toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const user = await res.json();
        if (res.ok && user) {
          const { access_token } = user;
          return { name: access_token } as User;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {},
};
