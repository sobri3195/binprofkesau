/**
 * Database Migration Script
 * 
 * This script applies pending migrations to the database.
 * Run with: npm run db:migrate
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runMigrations() {
  const databaseUrl = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not found in environment variables');
    console.error('Please set VITE_DATABASE_URL or DATABASE_URL in your .env file');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  try {
    console.log('🚀 Running migrations...');
    
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
