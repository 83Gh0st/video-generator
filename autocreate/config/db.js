import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Initialize the Neon client using the environment variable
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);

// Initialize Drizzle ORM with the Neon client
export const db = drizzle(sql);
