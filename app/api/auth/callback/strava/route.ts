import { NextRequest, NextResponse } from 'next/server'
import { exchangeStravaCode } from '@/lib/strava'
import { encrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { getServerSessionFromRequest } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/profile?error=strava_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/profile?error=no_code', request.url))
  }

  try {
    const session = await getServerSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const tokenData = await exchangeStravaCode(code)

    // Store Strava account
    await prisma.stravaAccount.upsert({
      where: { userId: session.user.id },
      update: {
        athleteStravaId: tokenData.athlete.id.toString(),
        accessTokenEnc: encrypt(tokenData.access_token),
        refreshTokenEnc: encrypt(tokenData.refresh_token),
        expiresAt: new Date(tokenData.expires_at * 1000),
      },
      create: {
        userId: session.user.id,
        athleteStravaId: tokenData.athlete.id.toString(),
        accessTokenEnc: encrypt(tokenData.access_token),
        refreshTokenEnc: encrypt(tokenData.refresh_token),
        expiresAt: new Date(tokenData.expires_at * 1000),
      },
    })

    return NextResponse.redirect(new URL('/profile?strava=connected', request.url))
  } catch (error) {
    console.error('Strava callback error:', error)
    return NextResponse.redirect(new URL('/profile?error=strava_failed', request.url))
  }
}
