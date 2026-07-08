interface HealthBarProps {
  hp: number;
  maxHp: number;
  energy: number;
  name: string;
  align?: 'left' | 'right';
}

/** Bar HP + energy bar dengan frame pixel art. */
export default function HealthBar({ hp, maxHp, energy, name, align = 'left' }: HealthBarProps) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const isSpecialReady = energy >= 100;
  const barColor = pct > 60 ? '#2ed573' : pct > 30 ? '#ffd93d' : '#ff4757';

  return (
    <div className={`pixel-panel flex flex-col gap-1 p-2 sm:p-3 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <span className="font-pixel text-[8px] leading-tight text-white drop-shadow sm:text-[11px]">{name}</span>
      <div className="h-3 w-36 overflow-hidden rounded bg-black/60 sm:h-4 sm:w-52" style={{ border: '2px solid #1a1a2e' }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <div
        className={`h-1.5 w-32 overflow-hidden rounded bg-black/60 transition-all sm:h-2 sm:w-44 ${
          isSpecialReady ? 'shadow-[0_0_8px_2px_#ffd93d]' : ''
        }`}
        style={{ border: `1px solid ${isSpecialReady ? '#ffd93d' : '#1a1a2e'}` }}
      >
        <div className="h-full bg-chaos-yellow transition-all" style={{ width: `${energy}%` }} />
      </div>
      {isSpecialReady && (
        <span className="font-game animate-pulse text-[11px] font-bold leading-none text-chaos-yellow drop-shadow sm:text-xs">
          SPECIAL SIAP
        </span>
      )}
    </div>
  );
}
