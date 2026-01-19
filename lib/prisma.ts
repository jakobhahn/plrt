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

// Normalize DATABASE_URL: ensure sslmode=verify-full is present for Neon (to avoid warnings)
let connectionString = databaseUrl.trim()
if (!connectionString.includes('sslmode=')) {
  // Add sslmode=verify-full if not already present (explicit to avoid warnings)
  const separator = connectionString.includes('?') ? '&' : '?'
  connectionString = `${connectionString}${separator}sslmode=verify-full`
} else if (connectionString.includes('sslmode=require')) {
  // Replace require with verify-full to avoid warnings
  connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full')
}

// Create pool with proper error handling
let pool: Pool
let adapter: PrismaPg

try {
  pool = new Pool({ connectionString })
  adapter = new PrismaPg(pool)
} catch (error) {
  console.error('Failed to create database connection pool:', error)
  throw new Error(`Invalid DATABASE_URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter } as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
