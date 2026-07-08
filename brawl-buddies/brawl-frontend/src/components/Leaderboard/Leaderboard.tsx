import { useEffect, useState } from 'react';

interface Entry {
  username: string;
  score: number;
}

const API = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';

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
    <section className="chaos-card w-full max-w-2xl p-5 sm:p-7">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-game text-xl leading-none text-[#8c3a2d]">Papan order paling panas</p>
          <h2 className="font-impact-game text-5xl uppercase leading-none text-[#2c1621] [text-shadow:3px_3px_0_#ffcf5a]">
            Top Chef
          </h2>
        </div>
        <div className="hidden rotate-6 rounded-xl border-4 border-[#2c1621] bg-[#ff4c55] px-3 py-2 font-pixel text-[10px] text-white shadow-[4px_4px_0_#2c1621] sm:block">
          HOT LIST
        </div>
      </div>

      {error && (
        <div className="order-ticket mb-4 px-4 py-3 font-game text-xl leading-none text-[#6d3b2d]">
          Server offline. Main dulu, skor tetap disimpan lokal.
        </div>
      )}

      <ol className="flex flex-col gap-3">
        {entries.map((entry, index) => (
          <li
            key={`${entry.username}-${index}`}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-xl border-2 border-[#2c1621] bg-white/75 px-3 py-2 shadow-[4px_4px_0_#2c1621]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#2c1621] bg-[#ffcf5a] font-impact-game text-2xl leading-none text-[#2c1621]">
              {index + 1}
            </span>
            <span className="font-game text-2xl font-bold leading-none text-[#351827]">{entry.username}</span>
            <span className="font-pixel text-[10px] leading-relaxed text-[#c4203d]">
              {entry.score.toLocaleString('id-ID')}
            </span>
          </li>
        ))}

        {!error && entries.length === 0 && (
          <li className="order-ticket px-4 py-5 text-center font-game text-2xl leading-none text-[#6d3b2d]">
            Belum ada skor. Jadi chef pertama yang bikin dapur heboh.
          </li>
        )}
      </ol>
    </section>
  );
}
