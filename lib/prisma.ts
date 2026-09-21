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
    connectionTimeoutMillis: 10000, // 10 seconds timeout for Neon serverless cold starts
    idleTimeoutMillis: 15000, // keep connections warm for 15 seconds to avoid handshake latency on consecutive queries
    max: 10, // allow up to 10 concurrent connections to handle parallel Next.js page queries without starvation
    ssl: connectionString?.includes('sslmode=') || (!connectionString?.includes('localhost') && !connectionString?.includes('127.0.0.1'))
      ? { rejectUnauthorized: false }
      : undefined
  })

  globalForPrisma.pool.on('error', (err) => {
    console.error('[DATABASE POOL ERROR] Stale connection or socket issue:', err)
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

// Always preserve prisma and pool globally to prevent connection leaks in both dev and production
globalForPrisma.prisma = prisma


