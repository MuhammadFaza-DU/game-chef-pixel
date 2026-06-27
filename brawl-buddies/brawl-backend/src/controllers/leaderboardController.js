import { leaderboardStore } from '../utils/redis.js';
import { ScoreModel } from '../models/Score.js';

/** POST /api/leaderboard — submit skor (guest atau login). */
export async function submitScore(req, res) {
  const { username, score, world = 1 } = req.body;
  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: 'username & score wajib' });
  }
  try {
    await leaderboardStore.add(username, score); // Redis (real-time)
    await ScoreModel.insert({ username, score, world }); // MySQL (permanen)
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** GET /api/leaderboard — top 10. Redis dulu, fallback MySQL. */
export async function getLeaderboard(_req, res) {
  try {
    let entries = await leaderboardStore.top(10);
    if (entries.length === 0) entries = await ScoreModel.top(10);
    res.json({ entries });
  } catch (e) {
    res.status(500).json({ error: e.message, entries: [] });
  }
}
