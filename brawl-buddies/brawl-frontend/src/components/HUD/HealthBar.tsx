interface HealthBarProps {
  hp: number;
  maxHp: number;
  energy: number;
  name: string;
  align?: 'left' | 'right';
}

export default function HealthBar({ hp, maxHp, energy, name, align = 'left' }: HealthBarProps) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const energyPct = Math.max(0, Math.min(100, energy));
  const isSpecialReady = energy >= 100;
  const barColor = pct > 60 ? '#34c98f' : pct > 30 ? '#ffcf5a' : '#ff4c55';

  return (
    <div className={`hud-panel flex min-w-[10.5rem] flex-col gap-1.5 p-2 sm:min-w-[15rem] sm:p-3 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-pixel text-[8px] leading-tight text-[#2c1621] sm:text-[10px]">{name}</span>
        <span className="font-game text-base font-bold leading-none text-[#c4203d]">{Math.ceil(hp)}/{maxHp}</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full border-2 border-[#2c1621] bg-[#1b1020]">
        <div className="h-full rounded-full transition-all duration-150" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <div className={`h-2.5 w-full overflow-hidden rounded-full border-2 bg-[#1b1020] ${isSpecialReady ? 'border-[#ffcf5a] shadow-[0_0_14px_rgba(255,207,90,.65)]' : 'border-[#2c1621]'}`}>
        <div className="h-full rounded-full bg-[#ffcf5a] transition-all" style={{ width: `${energyPct}%` }} />
      </div>
      {isSpecialReady && (
        <span className="font-game animate-pulse text-base font-bold leading-none text-[#c4203d] sm:text-lg">
          Special siap!
        </span>
      )}
    </div>
  );
}
