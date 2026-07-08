import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useAchievementStore } from '../store/useAchievementStore';
import { CHARACTERS } from '../game/entities/characters';
import Button from '../components/common/Button';

export default function ProfilePage() {
  const nav = useNavigate();
  const { username, setUsername, highScore, selectedCharacter } = usePlayerStore();
  const achievements = useAchievementStore((s) => s.achievements);
  const selected = CHARACTERS[selectedCharacter];

  return (
    <div className="kitchen-screen min-h-screen overflow-y-auto px-5 py-6 sm:px-8">
      <main className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="chaos-card p-5 sm:p-7">
          <p className="font-game text-xl leading-none text-[#8c3a2d]">Kartu chef aktif</p>
          <h1 className="font-impact-game text-5xl uppercase leading-none text-[#2c1621] [text-shadow:3px_3px_0_#ffcf5a] sm:text-6xl">
            Profil Chef
          </h1>

          <div className="mt-5 rounded-2xl border-4 border-[#2c1621] bg-white/70 p-4 shadow-[5px_5px_0_#2c1621]">
            <label className="font-pixel text-[10px] leading-relaxed text-[#c4203d]">NAMA DI PAPAN ORDER</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border-4 border-[#2c1621] bg-[#fff9e8] px-3 py-3 font-game text-2xl leading-none text-[#351827] outline-none transition focus:translate-y-[-2px] focus:shadow-[4px_5px_0_#2c1621]"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="order-ticket px-3 py-3">
                <span className="font-game text-lg leading-none text-[#8c3a2d]">Chef Favorit</span>
                <p className="mt-1 font-game text-3xl font-bold leading-none text-[#351827]">
                  {selected.emoji} {selected.name}
                </p>
              </div>
              <div className="order-ticket px-3 py-3">
                <span className="font-game text-lg leading-none text-[#8c3a2d]">High Score</span>
                <p className="mt-1 font-pixel text-[13px] leading-relaxed text-[#c4203d]">
                  {highScore.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <Button className="secondary mt-5 w-full" variant="ghost" onClick={() => nav('/')}>
            Kembali Ke Menu
          </Button>
        </section>

        <section className="chaos-card-dark p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-game text-xl leading-none text-[#ffcf5a]">Stempel prestasi dapur</p>
              <h2 className="font-impact-game text-5xl uppercase leading-none text-white [text-shadow:3px_3px_0_#c4203d]">
                Achievement
              </h2>
            </div>
          </div>

          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`grid grid-cols-[3.25rem_1fr] items-center gap-3 rounded-2xl border-4 p-3 shadow-[4px_4px_0_#120812] ${
                  achievement.unlocked
                    ? 'border-[#ffcf5a] bg-[#fff7d8] text-[#351827]'
                    : 'border-white/20 bg-white/8 text-white/55'
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-current bg-white/25 text-2xl">
                  {achievement.emoji}
                </span>
                <div>
                  <p className="font-game text-2xl font-bold leading-none">{achievement.name}</p>
                  <p className="mt-1 font-game text-lg leading-none opacity-75">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
