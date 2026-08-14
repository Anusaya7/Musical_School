import { PrismaClient } from '@/lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient
  pool?: Pool
  adapter?: PrismaPg
}

const connectionString = process.env.DATABASE_URL

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: connectionString || undefined,
    connectionTimeoutMillis: 10000, // 10 seconds to allow serverless DB wakeup
    idleTimeoutMillis: 30000,
    max: process.env.NODE_ENV === 'production' ? 2 : 5, // limit connection pool size to prevent exhaustion
    ssl: connectionString?.includes('sslmode=') || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined
  })
}

if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool)
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: globalForPrisma.adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}


