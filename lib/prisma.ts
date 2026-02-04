// lib/prisma.ts
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// Only set up WebSocket for Node.js server environment
// Skip for Edge runtime where native fetch is used
if (typeof globalThis.WebSocket === 'undefined') {
  // Dynamic import to avoid issues in Edge runtime
  try {
    // Use undici WebSocket which is more compatible
    neonConfig.webSocketConstructor = require('ws')
  } catch {
    // If ws fails, Neon will use fetch-based approach
    console.warn('WebSocket not available, using HTTP fallback')
  }
}

// Use pooled connection for better performance
neonConfig.poolQueryViaFetch = true
neonConfig.useSecureWebSocket = true

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
