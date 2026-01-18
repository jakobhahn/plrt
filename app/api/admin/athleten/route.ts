import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const athleteSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  photoUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  disciplines: z.array(z.string()).min(1),
  group: z.string().nullable(),
  achievements: z.string().nullable(),
  active: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSessionFromRequest(request)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = athleteSchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.athlete.findUnique({
      where: { slug: data.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Slug bereits vergeben' },
        { status: 400 }
      )
    }

    const athlete = await prisma.athlete.create({
      data,
    })

    return NextResponse.json(athlete)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating athlete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
