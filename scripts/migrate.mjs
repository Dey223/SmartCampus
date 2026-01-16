#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from '@neondatabase/serverless'

async function runMigrations() {
  // Read .env.local file
  const envPath = join(process.cwd(), '.env.local')
  const envFile = readFileSync(envPath, 'utf8')
  
  // Parse DATABASE_URL from .env.local
  const databaseUrlMatch = envFile.match(/DATABASE_URL=(.+)/)
  const databaseUrl = databaseUrlMatch ? databaseUrlMatch[1].trim() : null

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set in .env.local')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: databaseUrl })
  
  try {
    console.log('🚀 Starting database migrations...\n')

    // Read SQL files
    const schema = readFileSync(join(process.cwd(), 'scripts/001-create-smartcampus-schema.sql'), 'utf8')
    const buildings = readFileSync(join(process.cwd(), 'scripts/002-seed-buildings-rooms.sql'), 'utf8')
    const sampleData = readFileSync(join(process.cwd(), 'scripts/003-seed-sample-data.sql'), 'utf8')

    // Get a client from the pool
    const client = await pool.connect()
    
    try {
      // Execute migrations
      console.log('📋 Running: 001-create-smartcampus-schema.sql')
      await client.query(schema)
      console.log('✅ Schema created successfully\n')

      console.log('🏢 Running: 002-seed-buildings-rooms.sql')
      await client.query(buildings)
      console.log('✅ Buildings and rooms seeded successfully\n')

      console.log('📊 Running: 003-seed-sample-data.sql')
      await client.query(sampleData)
      console.log('✅ Sample data loaded successfully\n')

      console.log('🎉 All migrations completed successfully!')
      console.log('✨ Your database is ready to use!\n')
      console.log('🚀 Now run: pnpm dev')
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()
