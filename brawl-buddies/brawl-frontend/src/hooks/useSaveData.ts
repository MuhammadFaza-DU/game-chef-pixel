import { useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

const API = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';

/**
 * Save system: Guest Mode pakai localStorage (via zustand persist),
 * Logged-in sync ke backend. Auto-save dipanggil setelah level selesai.
 */
export function useSaveData() {
  const { username, highScore, submitScore } = usePlayerStore();

  const saveScore = useCallback(
    async (score: number) => {
      submitScore(score);
      try {
        await fetch(`${API}/api/leaderboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, score }),
        });
      } catch {
        // offline: cukup tersimpan di localStorage
      }
    },
    [username, submitScore],
  );

  return { saveScore, highScore };
}
