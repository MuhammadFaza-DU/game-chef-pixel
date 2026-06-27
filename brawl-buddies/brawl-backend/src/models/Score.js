import { getPool } from '../../config/db.js';

/** Riwayat skor permanen (leaderboard real-time pakai Redis). */
export const ScoreModel = {
  schema: `
    CREATE TABLE IF NOT EXISTS scores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      username VARCHAR(32) NOT NULL,
      score INT NOT NULL,
      world INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_score (score DESC)
    )`,

  async insert({ userId = null, username, score, world = 1 }) {
    const pool = getPool();
    if (!pool) return null;
    const [res] = await pool.query(
      'INSERT INTO scores (user_id, username, score, world) VALUES (?, ?, ?, ?)',
      [userId, username, score, world],
    );
    return res.insertId;
  },

  async top(limit = 10) {
    const pool = getPool();
    if (!pool) return [];
    const [rows] = await pool.query('SELECT username, score FROM scores ORDER BY score DESC LIMIT ?', [limit]);
    return rows;
  },
};
