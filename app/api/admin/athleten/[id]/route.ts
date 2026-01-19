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
  userEmail: z.string().email().nullable().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSessionFromRequest(request)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = athleteSchema.parse(body)

    // Check if slug already exists for another athlete
    const existing = await prisma.athlete.findUnique({
      where: { slug: data.slug },
    })
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: 'Slug bereits vergeben' },
        { status: 400 }
      )
    }

    // If userEmail is provided, find the user and link them
    let userId: string | null | undefined = undefined
    if (data.userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: data.userEmail },
      })
      if (user) {
        // Check if user already has an athlete profile (excluding current athlete)
        const existingAthlete = await prisma.athlete.findUnique({
          where: { userId: user.id },
        })
        if (existingAthlete && existingAthlete.id !== id) {
          return NextResponse.json(
            { error: `User ${data.userEmail} hat bereits ein Athletenprofil` },
            { status: 400 }
          )
        }
        userId = user.id
      } else {
        return NextResponse.json(
          { error: `User mit E-Mail ${data.userEmail} nicht gefunden` },
          { status: 400 }
        )
      }
    } else {
      // If no email provided, keep existing userId or set to null
      const currentAthlete = await prisma.athlete.findUnique({
        where: { id },
        select: { userId: true },
      })
      userId = currentAthlete?.userId ?? null
    }

    const { userEmail, ...athleteData } = data

    const athlete = await prisma.athlete.update({
      where: { id },
      data: {
        ...athleteData,
        userId,
      },
    })

    return NextResponse.json(athlete)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating athlete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSessionFromRequest(request)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.athlete.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting athlete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
