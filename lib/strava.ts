import { encrypt, decrypt } from './encryption'
import { prisma } from './prisma'

export interface StravaActivity {
  id: number
  type: string
  distance: number // in meters
  start_date: string
}

export interface StravaTokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: {
    id: number
  }
}

export async function exchangeStravaCode(code: string): Promise<StravaTokenResponse> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange Strava code')
  }

  return response.json()
}

export async function refreshStravaToken(refreshTokenEnc: string): Promise<{
  access_token: string
  refresh_token: string
  expires_at: number
}> {
  const refreshToken = decrypt(refreshTokenEnc)

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Strava token')
  }

  return response.json()
}

export async function getStravaActivities(
  accessTokenEnc: string,
  after?: number
): Promise<StravaActivity[]> {
  const accessToken = decrypt(accessTokenEnc)
  const afterParam = after ? `&after=${after}` : ''
  
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=200${afterParam}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expired')
    }
    throw new Error('Failed to fetch Strava activities')
  }

  return response.json()
}

export async function syncAthleteStravaData(userId: string) {
  const stravaAccount = await prisma.stravaAccount.findUnique({
    where: { userId },
    include: { user: { include: { athlete: true } } },
  })

  if (!stravaAccount || !stravaAccount.user.athlete) {
    return
  }

  const athlete = stravaAccount.user.athlete
  let accessToken = stravaAccount.accessTokenEnc
  let refreshToken = stravaAccount.refreshTokenEnc

  // Check if token is expired
  if (new Date() >= stravaAccount.expiresAt) {
    try {
      const refreshed = await refreshStravaToken(refreshToken)
      accessToken = encrypt(refreshed.access_token)
      refreshToken = encrypt(refreshed.refresh_token)

      await prisma.stravaAccount.update({
        where: { userId },
        data: {
          accessTokenEnc: accessToken,
          refreshTokenEnc: refreshToken,
          expiresAt: new Date(refreshed.expires_at * 1000),
        },
      })
    } catch (error) {
      console.error('Failed to refresh Strava token:', error)
      return
    }
  }

  // Get activities from last sync or last year
  const lastSync = stravaAccount.lastSyncAt || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  const after = Math.floor(lastSync.getTime() / 1000)

  try {
    const activities = await getStravaActivities(accessToken, after)

    // Calculate yearly stats
    const currentYear = new Date().getFullYear()
    const yearStart = new Date(currentYear, 0, 1).getTime() / 1000

    let runKm = 0
    let bikeKm = 0

    for (const activity of activities) {
      const activityDate = new Date(activity.start_date).getTime() / 1000
      if (activityDate >= yearStart) {
        const km = activity.distance / 1000
        if (activity.type === 'Run') {
          runKm += km
        } else if (activity.type === 'Ride' || activity.type === 'VirtualRide') {
          bikeKm += km
        }
      }
    }

    // Update or create year stats
    await prisma.stravaYearStats.upsert({
      where: {
        athleteId_year: {
          athleteId: athlete.id,
          year: currentYear,
        },
      },
      update: {
        runKm,
        bikeKm,
        updatedAt: new Date(),
      },
      create: {
        athleteId: athlete.id,
        year: currentYear,
        runKm,
        bikeKm,
      },
    })

    // Update last sync time
    await prisma.stravaAccount.update({
      where: { userId },
      data: { lastSyncAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to sync Strava data:', error)
  }
}
