import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useAchievementStore } from '../store/useAchievementStore';
import { CHARACTERS } from '../game/entities/characters';
import Button from '../components/common/Button';

export default function ProfilePage() {
  const nav = useNavigate();
  const { username, setUsername, highScore, selectedCharacter } = usePlayerStore();
  const achievements = useAchievementStore((s) => s.achievements);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-chaos-ink p-8 text-white">
      <h1 className="text-4xl font-bold text-chaos-yellow">👤 Profil Chef</h1>

      <div className="flex w-full max-w-md flex-col gap-3 rounded-3xl border-4 border-white/30 p-6">
        <label className="text-sm text-white/70">Nama</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-xl border-2 border-chaos-ink px-3 py-2 text-chaos-ink"
        />
        <p>Karakter favorit: {CHARACTERS[selectedCharacter].emoji} {CHARACTERS[selectedCharacter].name}</p>
        <p>High Score: <span className="font-bold text-chaos-yellow">{highScore.toLocaleString('id-ID')}</span></p>
      </div>

      <div className="w-full max-w-md">
        <h2 className="mb-2 text-2xl font-bold">🏆 Achievement</h2>
        <div className="grid grid-cols-1 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border-2 p-2 ${
                a.unlocked ? 'border-chaos-yellow bg-white/10' : 'border-white/20 opacity-50'
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <div>
                <p className="font-bold">{a.name}</p>
                <p className="text-xs text-white/60">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="ghost" onClick={() => nav('/')}>
        ← Kembali
      </Button>
    </div>
  );
}
