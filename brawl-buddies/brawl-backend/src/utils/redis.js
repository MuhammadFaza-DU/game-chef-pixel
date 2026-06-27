import { getRedis } from '../../config/redis.js';

const LEADERBOARD_KEY = 'leaderboard:global';

/** Helper sorted-set leaderboard. Aman bila Redis offline (no-op). */
export const leaderboardStore = {
  async add(username, score) {
    const r = getRedis();
    if (!r) return false;
    await r.zadd(LEADERBOARD_KEY, score, username);
    return true;
  },

  async top(limit = 10) {
    const r = getRedis();
    if (!r) return [];
    const raw = await r.zrevrange(LEADERBOARD_KEY, 0, limit - 1, 'WITHSCORES');
    const entries = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ username: raw[i], score: Number(raw[i + 1]) });
    }
    return entries;
  },
};
