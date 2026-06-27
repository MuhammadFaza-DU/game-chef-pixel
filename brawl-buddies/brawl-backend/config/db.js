import mysql from 'mysql2/promise';
import logger from '../src/utils/logger.js';

let pool = null;

/** Inisialisasi koneksi pool MySQL. */
export async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brawl_buddies',
    waitForConnections: true,
    connectionLimit: 10,
  });
  await pool.query('SELECT 1');
  logger.info('✅ MySQL terhubung');
  return pool;
}

/** Akses pool (null bila DB belum siap — controller wajib cek). */
export function getPool() {
  return pool;
}
