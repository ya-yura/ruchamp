'use server';

import { auth } from "./client-api/auth";

// Get user data from client side
export async function getUserData(token: string) {
  // auth.getCurrentUser(token).then((res) => console.log('res', res));
}
