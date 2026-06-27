import { getPool } from '../../config/db.js';

/** Achievement yang dibuka pemain. */
export const AchievementModel = {
  schema: `
    CREATE TABLE IF NOT EXISTS achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      achievement_id VARCHAR(64) NOT NULL,
      unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user_ach (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

  async listForUser(userId) {
    const pool = getPool();
    if (!pool) return [];
    const [rows] = await pool.query('SELECT achievement_id, unlocked_at FROM achievements WHERE user_id = ?', [userId]);
    return rows;
  },

  async unlock(userId, achievementId) {
    const pool = getPool();
    if (!pool) return;
    await pool.query(
      'INSERT IGNORE INTO achievements (user_id, achievement_id) VALUES (?, ?)',
      [userId, achievementId],
    );
  },
};
