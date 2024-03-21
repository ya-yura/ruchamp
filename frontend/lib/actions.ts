'use server';
// Yet it does not work in a proper way

import { signIn } from 'next-auth/react';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const rawFormData = {
    username: formData.get('username'),
    password: formData.get('password'),
  };
  try {
    await signIn('credentials', rawFormData);
  } catch (error) {
    console.log('Invalid credentials or something went wrong');
    // if (error instanceof AuthError) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return 'Invalid credentials.';
    //     default:
    //       return 'Something went wrong.';
    //   }
    // }
    return 'Something went wrong.';
    // throw error;
  }
}
