/**
 * Prisma Client Instance
 * 
 * Single shared instance of Prisma Client for the entire application.
 * Best practice: Don't create multiple instances.
 */

import { PrismaClient } from '@prisma/client';

// Add prisma to global type to avoid multiple instances in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create single instance
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// In development, save to global to avoid multiple instances on hot reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
