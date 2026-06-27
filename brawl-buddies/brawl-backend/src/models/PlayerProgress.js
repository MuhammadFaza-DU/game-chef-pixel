import { getPool } from '../../config/db.js';

/** Progress pemain: world tercapai, karakter unlock. */
export const PlayerProgressModel = {
  schema: `
    CREATE TABLE IF NOT EXISTS player_progress (
      user_id INT PRIMARY KEY,
      max_world INT DEFAULT 1,
      unlocked_characters JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

  async get(userId) {
    const pool = getPool();
    if (!pool) return null;
    const [rows] = await pool.query('SELECT * FROM player_progress WHERE user_id = ?', [userId]);
    return rows[0] ?? null;
  },

  async upsert(userId, { maxWorld, unlockedCharacters }) {
    const pool = getPool();
    if (!pool) throw new Error('DB tidak tersedia');
    await pool.query(
      `INSERT INTO player_progress (user_id, max_world, unlocked_characters)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE max_world = VALUES(max_world), unlocked_characters = VALUES(unlocked_characters)`,
      [userId, maxWorld, JSON.stringify(unlockedCharacters)],
    );
  },
};
