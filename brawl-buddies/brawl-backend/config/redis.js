import Redis from 'ioredis';
import logger from '../src/utils/logger.js';

let client = null;

/** Inisialisasi Redis (leaderboard & session). */
export async function initRedis() {
  client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  await client.connect();
  logger.info('✅ Redis terhubung');
  return client;
}

export function getRedis() {
  return client;
}
