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

const BOSS_DISPLAY: Record<string, string> = {
  ChefRobotMicro: 'CHEF ROBOT MICRO',
  KasirMutan: 'KASIR MUTAN',
  DuoMCMakan: 'DUO MC MAKAN',
  ChefBesarMangkukJahat: 'CHEF BESAR MANGKUK JAHAT',
};

function HpBar({ hp, maxHp, label }: { hp: number; maxHp: number; label?: string }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const barColor = pct > 60 ? '#2ed573' : pct > 30 ? '#ffd93d' : '#ff4757';
  return (
    <div>
      {label && (
        <div className="font-pixel mb-0.5 text-[6px] tracking-wider" style={{ color: '#ffd93d' }}>
          {label}
        </div>
      )}
      <div className="h-4 w-full overflow-hidden rounded bg-black/60" style={{ border: '2px solid #1a1a2e' }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="font-game mt-1 text-right text-sm font-bold" style={{ color: barColor }}>
        HP: {Math.ceil(hp)}/{maxHp}
      </div>
    </div>
  );
}

export default function BossHpBar() {
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

  return (
    <div
      className={`absolute left-1/2 top-2 -translate-x-1/2 ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}
      style={{ width: 380, zIndex: 50 }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(-50%) translateX(0); }
          25%       { transform: translateX(-50%) translateX(-5px); }
          75%       { transform: translateX(-50%) translateX(5px); }
        }
      `}</style>
      <div className="pixel-panel px-4 py-2">
        <div className="font-pixel mb-2 text-center text-[7px] leading-relaxed tracking-wider text-chaos-red drop-shadow">
          {displayName}
        </div>
        <HpBar hp={boss.hp} maxHp={boss.maxHp} label={boss.bossB ? 'BESAR' : undefined} />
        {boss.bossB && (
          <div className="mt-2">
            <HpBar hp={boss.bossB.hp} maxHp={boss.bossB.maxHp} label="KECIL" />
          </div>
        )}
      </div>
    </div>
  );
}
