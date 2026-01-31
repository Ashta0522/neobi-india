/**
 * NeoBI India v2.0 - Database Client
 * Prisma client with connection pooling and error handling
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Helper to handle Prisma errors
export function handlePrismaError(error: any) {
  if (error.code === 'P2002') {
    return { error: 'A record with this value already exists.' };
  }
  if (error.code === 'P2025') {
    return { error: 'Record not found.' };
  }
  if (error.code === 'P2003') {
    return { error: 'Foreign key constraint failed.' };
  }

  console.error('Prisma error:', error);
  return { error: 'Database operation failed.' };
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    await db.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
