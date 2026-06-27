import type { ActivePowerUp } from '../../game/EventBus';

const POWERUP_ICON: Record<string, string> = {
  'ayam-geprek': '🍗',
  sambal: '🍅',
  omelet: '🍳',
  'es-pisang': '🧊',
  'nasi-goreng-kosmik': '✨',
};

function getIcon(p: ActivePowerUp) {
  return POWERUP_ICON[p.id] ?? '⚡';
}

interface Props {
  powerups: ActivePowerUp[];
}

export default function PowerUpBar({ powerups }: Props) {
  if (powerups.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {powerups.map((p) => {
        const pct = Math.max(0, (p.remaining / p.durationMs) * 100);
        const barColor = pct > 25 ? '#2ed573' : '#ff4757';
        const fading = p.remaining < 500;
        return (
          <div
            key={p.id}
            className={`pixel-panel flex items-center gap-2 px-2 py-1 transition-opacity duration-300 ${fading ? 'opacity-40' : 'opacity-100'}`}
          >
            <span className="text-base leading-none">{getIcon(p)}</span>
            <div className="w-20 overflow-hidden rounded bg-black/60" style={{ height: 6, border: '1px solid #1a1a2e' }}>
              <div
                className="h-full transition-all duration-200"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="font-game w-12 text-right text-sm font-bold" style={{ color: barColor }}>
              {(p.remaining / 1000).toFixed(1)}s
            </span>
          </div>
        );
      })}
    </div>
  );
}
