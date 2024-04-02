'use server';

import { auth } from './api/auth';

// export async function getUserData(token: string) {
//   auth
//     .getCurrentUser(token)
//     .catch((err) =>
//       console.log('Some problems with getting user on server side', err),
//     );
// }

export async function logOut(token: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded',
    authorization: `Bearer ${token}`,
  };

  const res = await fetch('http://127.0.0.1:8000/auth/jwt/logout', {
    method: 'POST',
    headers: headers,
  });
}
