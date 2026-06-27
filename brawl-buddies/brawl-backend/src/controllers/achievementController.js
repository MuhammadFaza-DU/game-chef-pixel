import { AchievementModel } from '../models/Achievement.js';

/** GET /api/achievements — daftar achievement pemain login. */
export async function listAchievements(req, res) {
  try {
    const rows = await AchievementModel.listForUser(req.user.id);
    res.json({ achievements: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** POST /api/achievements/unlock — buka achievement. */
export async function unlockAchievement(req, res) {
  const { achievementId } = req.body;
  if (!achievementId) return res.status(400).json({ error: 'achievementId wajib' });
  try {
    await AchievementModel.unlock(req.user.id, achievementId);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
