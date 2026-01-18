import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncAthleteStravaData } from '@/lib/strava'

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all users with Strava accounts
    const stravaAccounts = await prisma.stravaAccount.findMany({
      include: { user: true },
    })

    // Sync each account (with rate limiting in mind)
    for (const account of stravaAccounts) {
      try {
        await syncAthleteStravaData(account.userId)
        // Add delay to respect Strava rate limits (600 requests per 15 minutes)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Failed to sync user ${account.userId}:`, error)
      }
    }

    return NextResponse.json({ success: true, synced: stravaAccounts.length })
  } catch (error) {
    console.error('Cron sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
