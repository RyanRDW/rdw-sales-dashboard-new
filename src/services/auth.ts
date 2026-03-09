'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

export async function getAccessToken() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('sm8_access_token')?.value;
  const refreshToken = cookieStore.get('sm8_refresh_token')?.value;
  const tokenExpiry = cookieStore.get('sm8_token_expiry')?.value;

  if (!accessToken || !tokenExpiry || Date.now() >= parseInt(tokenExpiry)) {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Refresh token
    const clientId = process.env.SM8_APP_ID;
    const clientSecret = process.env.SM8_APP_SECRET;
    const tokenUrl = process.env.SM8_TOKEN_URL;

    const response = await axios.post(tokenUrl!, {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const { access_token, expires_in } = response.data;

    // Update cookies
    (cookieStore as any).set('sm8_access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expires_in });
    (cookieStore as any).set('sm8_token_expiry', (Date.now() + expires_in * 1000).toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    accessToken = access_token;
  }

  return accessToken;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get('sm8_access_token')?.value;
}