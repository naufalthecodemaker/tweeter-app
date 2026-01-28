import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// gw ganti dari sql jdi client biar ga konflik ama tag sql si drizzle
const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client });