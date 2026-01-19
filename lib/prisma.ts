import { PrismaClient } from '../generated/prisma-client/default'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// @ts-expect-error - Prisma 7 type definition issue
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
