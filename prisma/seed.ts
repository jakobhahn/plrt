import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// @ts-expect-error - Prisma 7 type definition issue
const prisma = new PrismaClient()

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

  // Create athletes
  const athlete1 = await prisma.athlete.upsert({
    where: { slug: 'max-mustermann' },
    update: {},
    create: {
      name: 'Max Mustermann',
      slug: 'max-mustermann',
      photoUrl: 'https://via.placeholder.com/400x400?text=Max+Mustermann',
      bio: 'Leidenschaftlicher Triathlet seit 2015. Spezialisiert auf Langdistanz-Triathlons.',
      disciplines: ['TRIATHLON', 'LAUF'],
      group: 'A',
      achievements: 'Ironman Frankfurt 2023 - 9:45:30\nHalbmarathon PB: 1:25:00',
      active: true,
      userId: memberUser.id,
    },
  })

  const athlete2 = await prisma.athlete.upsert({
    where: { slug: 'anna-schmidt' },
    update: {},
    create: {
      name: 'Anna Schmidt',
      slug: 'anna-schmidt',
      photoUrl: 'https://via.placeholder.com/400x400?text=Anna+Schmidt',
      bio: 'Fokus auf Laufen und Marathon. Trainerin für Anfänger.',
      disciplines: ['LAUF'],
      group: 'B',
      achievements: 'Marathon Berlin 2023 - 3:15:00\n10K PB: 38:30',
      active: true,
    },
  })

  const athlete3 = await prisma.athlete.upsert({
    where: { slug: 'thomas-weber' },
    update: {},
    create: {
      name: 'Thomas Weber',
      slug: 'thomas-weber',
      photoUrl: 'https://via.placeholder.com/400x400?text=Thomas+Weber',
      bio: 'Triathlet und Radsportler. Teilnahme an verschiedenen Wettkämpfen.',
      disciplines: ['TRIATHLON'],
      group: 'A',
      achievements: 'Ironman 70.3 - 4:30:00',
      active: true,
    },
  })

  // Create events
  const now = new Date()
  const events = [
    {
      title: 'Gruppentraining Laufen',
      description: 'Gemeinsames Lauftraining für alle Leistungsgruppen. Treffpunkt: Parkplatz am See.',
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endAt: null,
      location: 'Parkplatz am See',
      category: 'TRAINING' as const,
    },
    {
      title: 'Schwimmtraining',
      description: 'Techniktraining im Hallenbad.',
      startAt: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      endAt: null,
      location: 'Hallenbad Musterstadt',
      category: 'TRAINING' as const,
    },
    {
      title: 'Ironman Frankfurt',
      description: 'Teilnahme am Ironman Frankfurt. Gemeinsame Anreise.',
      startAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      location: 'Frankfurt am Main',
      category: 'WETTKAMPF' as const,
    },
    {
      title: 'Vereinsmeeting',
      description: 'Monatliches Vereinsmeeting mit Besprechung der anstehenden Termine.',
      startAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      endAt: null,
      location: 'Vereinsheim',
      category: 'VEREINSMEETING' as const,
    },
    {
      title: 'Radtraining',
      description: 'Ausfahrt durch die Umgebung. Dauer ca. 2-3 Stunden.',
      startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endAt: null,
      location: 'Vereinsheim',
      category: 'TRAINING' as const,
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event,
    })
  }

  // Create downloads
  const downloads = [
    {
      title: 'Mitgliedsantrag',
      fileUrl: 'https://example.com/mitgliedsantrag.pdf',
      fileSize: 245760, // 240 KB
    },
    {
      title: 'Vereinsordnung',
      fileUrl: 'https://example.com/vereinsordnung.pdf',
      fileSize: 512000, // 500 KB
    },
  ]

  for (const download of downloads) {
    await prisma.download.create({
      data: download,
    })
  }

  // Create sample year stats
  const currentYear = new Date().getFullYear()
  await prisma.stravaYearStats.upsert({
    where: {
      athleteId_year: {
        athleteId: athlete1.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      athleteId: athlete1.id,
      year: currentYear,
      runKm: 1250.5,
      bikeKm: 3200.0,
    },
  })

  await prisma.stravaYearStats.upsert({
    where: {
      athleteId_year: {
        athleteId: athlete2.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      athleteId: athlete2.id,
      year: currentYear,
      runKm: 1800.0,
      bikeKm: 500.0,
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
