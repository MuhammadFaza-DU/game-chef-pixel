import type { ActivePowerUp } from '../../game/EventBus';

const POWERUP_ICON: Record<string, string> = {
  'ayam-geprek': 'AG',
  sambal: 'SB',
  omelet: 'OM',
  'es-pisang': 'EP',
  'nasi-goreng-kosmik': 'NG',
};

function getIcon(p: ActivePowerUp) {
  return POWERUP_ICON[p.id] ?? 'SP';
}

interface Props {
  powerups: ActivePowerUp[];
}

export default function PowerUpBar({ powerups }: Props) {
  if (powerups.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {powerups.map((powerup) => {
        const pct = Math.max(0, (powerup.remaining / powerup.durationMs) * 100);
        const barColor = pct > 25 ? '#34c98f' : '#ff4c55';
        const fading = powerup.remaining < 500;

        return (
          <div
            key={powerup.id}
            className={`hud-panel flex items-center gap-1.5 px-2 py-1 transition-opacity duration-300 sm:gap-2 ${fading ? 'opacity-45' : 'opacity-100'}`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#2c1621] bg-[#ffcf5a] font-pixel text-[8px] leading-none text-[#2c1621]">
              {getIcon(powerup)}
            </span>
            <div className="h-2 w-14 overflow-hidden rounded-full border border-[#2c1621] bg-[#1b1020] sm:w-20">
              <div className="h-full transition-all duration-200" style={{ width: `${pct}%`, backgroundColor: barColor }} />
            </div>
            <span className="font-game w-9 text-right text-sm font-bold leading-none sm:w-12 sm:text-base" style={{ color: barColor }}>
              {(powerup.remaining / 1000).toFixed(1)}s
            </span>
          </div>
        );
      })}
    </div>
  );
}
