import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Server-only database connection.
 * Uses Neon's serverless driver over HTTP (not WebSocket) for simplicity in
 * server components, API routes, and server actions.
 *
 * Lazy-initialized singleton — avoids connection overhead on cold start
 * and prevents build-time failures when DATABASE_URL is unset.
 */

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('Missing DATABASE_URL');
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}
