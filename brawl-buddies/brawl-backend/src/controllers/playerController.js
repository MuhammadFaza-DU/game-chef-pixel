import { PlayerProgressModel } from '../models/PlayerProgress.js';

/** GET /api/players/progress — progress pemain login. */
export async function getProgress(req, res) {
  try {
    const progress = await PlayerProgressModel.get(req.user.id);
    res.json({ progress: progress ?? { max_world: 1, unlocked_characters: ['mimi', 'bobo', 'lala'] } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** PUT /api/players/progress — simpan progress (auto-save tiap level). */
export async function saveProgress(req, res) {
  const { maxWorld, unlockedCharacters } = req.body;
  try {
    await PlayerProgressModel.upsert(req.user.id, {
      maxWorld: maxWorld ?? 1,
      unlockedCharacters: unlockedCharacters ?? ['mimi', 'bobo', 'lala'],
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
