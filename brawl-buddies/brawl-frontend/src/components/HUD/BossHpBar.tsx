import { useEffect, useRef, useState } from 'react';
import { EventBus } from '../../game/EventBus';

interface BossBState {
  hp: number;
  maxHp: number;
}

interface BossState {
  name: string;
  hp: number;
  maxHp: number;
  bossB?: BossBState;
}

interface BossHpBarProps {
  score?: number;
  hits?: number;
  multiplier?: number;
}

const BOSS_DISPLAY: Record<string, string> = {
  ChefRobotMicro: 'CHEF ROBOT MICRO',
  KasirMutan: 'KASIR MUTAN',
  DuoMCMakan: 'DUO MC MAKAN',
  ChefBesarMangkukJahat: 'CHEF BESAR MANGKUK JAHAT',
};

function HpBar({ hp, maxHp, label }: { hp: number; maxHp: number; label?: string }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const barColor = pct > 60 ? '#34c98f' : pct > 30 ? '#ffcf5a' : '#ff4c55';

  return (
    <div>
      {label && (
        <div className="mb-1 font-pixel text-[7px] tracking-wider text-[#ffcf5a]">
          {label}
        </div>
      )}
      <div className="h-4 w-full overflow-hidden rounded-full border-2 border-[#2c1621] bg-[#180d1a]">
        <div className="h-full rounded-full transition-all duration-150" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <div className="font-game mt-1 text-right text-base font-bold leading-none" style={{ color: barColor }}>
        {Math.ceil(hp)}/{maxHp}
      </div>
    </div>
  );
}

export default function BossHpBar({ score = 0, hits = 0, multiplier = 1 }: BossHpBarProps) {
  const [boss, setBoss] = useState<BossState | null>(null);
  const [shaking, setShaking] = useState(false);
  const prevTotalHpRef = useRef<number>(Infinity);

  useEffect(() => {
    const onBoss = (data: BossState) => {
      const totalHp = data.hp + (data.bossB?.hp ?? 0);
      if (totalHp < prevTotalHpRef.current) {
        setShaking(true);
        setTimeout(() => setShaking(false), 300);
      }
      prevTotalHpRef.current = totalHp;
      setBoss(data);
    };
    const onClear = () => {
      setBoss(null);
      prevTotalHpRef.current = Infinity;
    };
    EventBus.on('boss', onBoss);
    EventBus.on('boss-clear', onClear);
    return () => {
      EventBus.off('boss', onBoss);
      EventBus.off('boss-clear', onClear);
    };
  }, []);

  if (!boss) return null;

  const displayName = BOSS_DISPLAY[boss.name] ?? boss.name;
  const safeScore = Number.isFinite(score) ? score : 0;

  return (
    <div
      className={`absolute left-1/2 top-2 -translate-x-1/2 ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}
      style={{ width: 'min(92vw, 430px)', zIndex: 50 }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(-50%) translateX(0); }
          25% { transform: translateX(-50%) translateX(-5px); }
          75% { transform: translateX(-50%) translateX(5px); }
        }
      `}</style>
      <div className="hud-panel-dark px-4 py-2">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full border-2 border-[#2c1621] bg-[#ff4c55] px-2 py-1 font-pixel text-[7px] leading-relaxed text-white shadow-[2px_2px_0_#2c1621]">
            BOSS ORDER
          </span>
          <span className="font-impact-game text-xl uppercase leading-none text-white [text-shadow:2px_2px_0_#c4203d] sm:text-2xl">
            {displayName}
          </span>
        </div>
        <HpBar hp={boss.hp} maxHp={boss.maxHp} label={boss.bossB ? 'BESAR' : undefined} />
        {boss.bossB && (
          <div className="mt-2">
            <HpBar hp={boss.bossB.hp} maxHp={boss.bossB.maxHp} label="KECIL" />
          </div>
        )}
        <div className="mt-2 flex items-center justify-center gap-2">
          {hits > 0 && (
            <span className="rounded-full border-2 border-[#2c1621] bg-[#ffcf5a] px-2 py-1 font-pixel text-[7px] leading-relaxed text-[#2c1621] shadow-[2px_2px_0_#2c1621]">
              COMBO x{multiplier}
            </span>
          )}
          <span className="rounded-xl border-2 border-[#2c1621] bg-[#fff7d8] px-3 py-1 font-game text-lg font-bold leading-none text-[#351827] shadow-[2px_2px_0_#2c1621]">
            Skor {safeScore.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
