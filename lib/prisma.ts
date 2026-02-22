// lib/prisma.ts
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// Configure Neon connection
neonConfig.poolQueryViaFetch = true

// Only configure WebSocket if not in Edge Runtime
/* 
if (typeof globalThis.WebSocket !== 'undefined') {
  try {
    const ws = require('ws')
    neonConfig.webSocketConstructor = ws
  } catch {
    // Fallback to fetch-based approach if ws is not available
    console.warn('WebSocket not available, using fetch-based queries')
  }
}
*/

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const adapter = new PrismaNeon({ connectionString })
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma