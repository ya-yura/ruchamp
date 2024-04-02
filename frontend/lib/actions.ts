'use server';

import { auth } from './client-api/auth';

// Get user data from client side
export async function getUserData(token: string) {
  auth
    .getCurrentUser(token)
    .catch((err) =>
      console.log('Some problems with getting user on server side', err),
    );
}
