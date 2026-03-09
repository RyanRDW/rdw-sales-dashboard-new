import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SM8_APP_ID;
  const redirectUri = process.env.SM8_CALLBACK_URL;
  const scopes = process.env.SM8_SCOPES?.replace(/"/g, '').split(' ').join('+') || '';
  const authUrl = `${process.env.SM8_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri!)}&scope=${scopes}`;

  return NextResponse.redirect(authUrl);
}