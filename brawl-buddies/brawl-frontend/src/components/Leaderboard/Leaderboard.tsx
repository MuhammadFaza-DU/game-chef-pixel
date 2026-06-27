import { useEffect, useState } from 'react';

interface Entry {
  username: string;
  score: number;
}

const API = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';

/** Papan skor (Redis-backed via backend). Fallback ke pesan bila offline. */
export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/leaderboard`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="rounded-3xl border-4 border-chaos-ink bg-white/90 p-6">
      <h2 className="mb-4 text-3xl font-bold text-chaos-red">🏆 Top Chef</h2>
      {error && <p className="text-chaos-ink/60">Server offline — main dulu, skor tersimpan lokal.</p>}
      <ol className="flex flex-col gap-2">
        {entries.map((e, i) => (
          <li key={i} className="flex justify-between border-b border-chaos-ink/20 py-1 font-mono">
            <span>
              {i + 1}. {e.username}
            </span>
            <span className="font-bold">{e.score.toLocaleString('id-ID')}</span>
          </li>
        ))}
        {!error && entries.length === 0 && <p className="text-chaos-ink/60">Belum ada skor. Jadilah yang pertama!</p>}
      </ol>
    </div>
  );
}
