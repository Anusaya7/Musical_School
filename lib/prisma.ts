import { PrismaClient } from '@/lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString || undefined,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
  max: 10,
  ssl: connectionString?.includes('sslmode=') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

