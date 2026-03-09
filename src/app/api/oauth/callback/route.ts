import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.SM8_APP_ID;
  const clientSecret = process.env.SM8_APP_SECRET;
  const redirectUri = process.env.SM8_CALLBACK_URL;
  const tokenUrl = process.env.SM8_TOKEN_URL;

  try {
    const response = await axios.post(tokenUrl!, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Store in cookies
    let redirectResponse = NextResponse.redirect(new URL('/', request.url));
    redirectResponse.cookies.set('sm8_access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expires_in });
    redirectResponse.cookies.set('sm8_refresh_token', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    redirectResponse.cookies.set('sm8_token_expiry', (Date.now() + expires_in * 1000).toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return redirectResponse;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}