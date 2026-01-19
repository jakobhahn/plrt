import { PrismaClient } from '../generated/prisma-client/default'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

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

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter } as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
