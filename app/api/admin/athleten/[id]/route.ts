import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = athleteSchema.parse(body)

    // Check if slug already exists for another athlete
    const existing = await prisma.athlete.findUnique({
      where: { slug: data.slug },
    })
    if (existing && existing.id !== params.id) {
      return NextResponse.json(
        { error: 'Slug bereits vergeben' },
        { status: 400 }
      )
    }

    const athlete = await prisma.athlete.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(athlete)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.athlete.delete({
      where: { id: params.id },
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
