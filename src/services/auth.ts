'use server';

import { cookies } from 'next/headers';

export async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sm8_token')?.value;
  if (!token) {
    throw new Error('No access token available');
  }
  return token;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get('sm8_token')?.value;
}
