import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use environment variable for database connection string
const connectionString = "postgresql://neondb_owner:L0hJn1FVjRKa@ep-tiny-snowflake-a1pcm6ln.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
if (!connectionString) {
    throw new Error("NEON_DATABASE_URL is not defined in environment variables.");
}

// Initialize the Neon client
const sql = neon(connectionString);

// Initialize Drizzle ORM with the Neon client
export const db = drizzle(sql);

console.log("Database connection initialized successfully!");
