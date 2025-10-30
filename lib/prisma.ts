// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // you can add 'query' too if you want to debug
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
