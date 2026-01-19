import { PrismaClient } from '../generated/prisma-client/default'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

// Ensure DATABASE_URL has proper SSL configuration for Neon
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Add sslmode=require if not already present (for Neon compatibility)
const connectionString = databaseUrl.includes('sslmode=')
  ? databaseUrl
  : `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@plrt.de' },
    update: {},
    create: {
      email: 'admin@plrt.de',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create member user
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@plrt.de' },
    update: {},
    create: {
      email: 'member@plrt.de',
      name: 'Member User',
      role: 'MEMBER',
    },
  })

  // Create sample athletes
  const athletes = await Promise.all([
    prisma.athlete.upsert({
      where: { slug: 'max-mustermann' },
      update: {},
      create: {
        name: 'Max Mustermann',
        slug: 'max-mustermann',
        disciplines: ['Triathlon', 'Laufen'],
        bio: 'Leidenschaftlicher Triathlet seit 2015',
        group: 'Elite',
        achievements: 'Ironman Finisher 2023',
        active: true,
      },
    }),
    prisma.athlete.upsert({
      where: { slug: 'anna-schmidt' },
      update: {},
      create: {
        name: 'Anna Schmidt',
        slug: 'anna-schmidt',
        disciplines: ['Laufen', 'Radfahren'],
        bio: 'Marathonläuferin und Radsportlerin',
        group: 'Aktive',
        active: true,
      },
    }),
    prisma.athlete.upsert({
      where: { slug: 'peter-weber' },
      update: {},
      create: {
        name: 'Peter Weber',
        slug: 'peter-weber',
        disciplines: ['Triathlon'],
        bio: 'Triathlon-Trainer und Athlet',
        group: 'Trainer',
        active: true,
      },
    }),
  ])

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Club-Lauf 2024',
        description: 'Jährlicher Club-Lauf für alle Mitglieder',
        startAt: new Date('2024-06-15T10:00:00Z'),
        location: 'Stadion PLRT',
        category: 'TRAINING',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Triathlon-Workshop',
        description: 'Workshop für Einsteiger in den Triathlon',
        startAt: new Date('2024-07-20T14:00:00Z'),
        location: 'Clubhaus',
        category: 'TRAINING',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Ironman Frankfurt 2024',
        description: 'Teilnahme am Ironman Frankfurt',
        startAt: new Date('2024-08-10T07:00:00Z'),
        location: 'Frankfurt am Main',
        category: 'TRAINING',
      },
    }),
  ])

  // Create sample downloads
  const downloads = await Promise.all([
    prisma.download.create({
      data: {
        title: 'Trainingsplan 2024',
        fileUrl: '/downloads/trainingsplan-2024.pdf',
        fileSize: 2048000,
      },
    }),
    prisma.download.create({
      data: {
        title: 'Vereinssatzung',
        fileUrl: '/downloads/vereinssatzung.pdf',
        fileSize: 512000,
      },
    }),
  ])

  console.log('Seed data created:')
  console.log(`- Users: ${adminUser.email}, ${memberUser.email}`)
  console.log(`- Athletes: ${athletes.length}`)
  console.log(`- Events: ${events.length}`)
  console.log(`- Downloads: ${downloads.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
