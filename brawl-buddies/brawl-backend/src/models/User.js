import { getPool } from '../../config/db.js';

/** Skema & query untuk tabel users. */
export const UserModel = {
  schema: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(32) UNIQUE NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

  async findByEmail(email) {
    const pool = getPool();
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] ?? null;
  },

  async create({ username, email, passwordHash }) {
    const pool = getPool();
    if (!pool) throw new Error('DB tidak tersedia');
    const [res] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash],
    );
    return { id: res.insertId, username, email };
  },
};
