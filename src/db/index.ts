import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Create connection pool
const pool = new Pool({ 
  connectionString: import.meta.env.VITE_DATABASE_URL 
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Export schema for use in queries
export * from './schema';
