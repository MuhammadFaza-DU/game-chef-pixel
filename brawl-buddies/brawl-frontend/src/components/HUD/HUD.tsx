import { useEffect, useRef, useState } from 'react';
import { EventBus, type HudState } from '../../game/EventBus';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { CHARACTERS } from '../../game/entities/characters';
import AudioManager from '../../game/systems/AudioManager';
import HealthBar from './HealthBar';
import ComboCounter from './ComboCounter';
import IngredientSlot from './IngredientSlot';
import BossHpBar from './BossHpBar';
import PowerUpBar from './PowerUpBar';

function PauseIcon() {
  return (
    <svg viewBox="0 0 8 10" width="14" height="18" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="0" y="0" width="3" height="10" fill="currentColor" opacity="0.9" />
      <rect x="5" y="0" width="3" height="10" fill="currentColor" opacity="0.9" />
      <rect x="0" y="0" width="1" height="10" fill="white" opacity="0.25" />
      <rect x="5" y="0" width="1" height="10" fill="white" opacity="0.25" />
    </svg>
  );
}

export default function HUD({ onPause }: { onPause?: () => void }) {
  const hud = useGameStore();
  const setHud = useGameStore((s) => s.setHud);
  const isMuted = useGameStore((s) => s.isMuted);
  const setMuted = useGameStore((s) => s.setMuted);
  const character = usePlayerStore((s) => s.selectedCharacter);

  const [waveTransition, setWaveTransition] = useState<{ wave: number; total: number } | null>(null);
  const [showSpecialFail, setShowSpecialFail] = useState(false);
  const specialFailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMuteToggle = () => {
    const next = AudioManager.toggle();
    setMuted(next);
  };

  useEffect(() => {
    const onHud = (state: HudState) => setHud(state);
    EventBus.on('hud', onHud);
    return () => { EventBus.off('hud', onHud); };
  }, [setHud]);

  useEffect(() => {
    const onWaveStart = (data: { wave: number; totalWaves: number }) => {
      setWaveTransition({ wave: data.wave, total: data.totalWaves });
      setTimeout(() => setWaveTransition(null), 1500);
    };
    EventBus.on('wave-start', onWaveStart);
    return () => { EventBus.off('wave-start', onWaveStart); };
  }, []);

  useEffect(() => {
    const onSpecialFail = () => {
      setShowSpecialFail(true);
      if (specialFailTimer.current) clearTimeout(specialFailTimer.current);
      specialFailTimer.current = setTimeout(() => setShowSpecialFail(false), 1200);
    };
    EventBus.on('special-fail', onSpecialFail);
    return () => {
      EventBus.off('special-fail', onSpecialFail);
      if (specialFailTimer.current) clearTimeout(specialFailTimer.current);
    };
  }, []);

  const waveIndicator = hud.isBoss
    ? 'BOSS'
    : Array.from({ length: hud.totalWaves }, (_, i) =>
        i < hud.wave - 1 ? '●' : i === hud.wave - 1 ? '◉' : '○',
      ).join(' ');

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2 sm:p-4">
      <BossHpBar />

      <div className="flex items-start justify-between gap-2">
        <HealthBar hp={hud.hp} maxHp={hud.maxHp} energy={hud.energy} name={CHARACTERS[character].name} />

        <div className="hidden sm:block">
          <ComboCounter hits={hud.combo.hits} multiplier={hud.combo.multiplier} score={hud.combo.score} />
        </div>

        <div className="flex items-start gap-2">
          <div className="pixel-panel px-2 py-1 text-center sm:px-4 sm:py-2">
            <div className="font-pixel text-[8px] text-chaos-yellow">WORLD {hud.world}</div>
            <div className="font-game text-sm tracking-widest text-white sm:text-base">{waveIndicator}</div>
          </div>
          <button
            className="pointer-events-auto pixel-panel hidden h-10 w-10 items-center justify-center text-lg transition-opacity hover:opacity-80 active:scale-95 sm:flex"
            onClick={handleMuteToggle}
            title={isMuted ? 'Aktifkan audio' : 'Matikan audio'}
          >
            {isMuted ? 'Mute' : 'Audio'}
          </button>
          <button
            className="pointer-events-auto pixel-panel hidden h-10 w-10 items-center justify-center transition-opacity hover:opacity-80 active:scale-95 sm:flex"
            onClick={onPause}
            title="Pause"
            style={{ color: '#00f5ff' }}
          >
            <PauseIcon />
          </button>
        </div>
      </div>

      {waveTransition && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="pixel-panel animate-[fadeInOut_1.5s_ease-in-out] px-10 py-6 text-center shadow-2xl">
            <div className="font-pixel text-sm leading-relaxed text-chaos-yellow drop-shadow-lg">
              WAVE {waveTransition.wave} DIMULAI!
            </div>
            <div className="font-game mt-2 text-xl text-white/80">Siapkan dirimu...</div>
          </div>
        </div>
      )}

      {showSpecialFail && (
        <div className="absolute left-2 top-24 animate-[fadeOut_1.2s_ease-in-out_forwards] pixel-panel px-3 py-1 sm:left-4 sm:top-28">
          <span className="font-game text-sm font-bold text-chaos-red">Energi belum penuh!</span>
        </div>
      )}

      <div className="flex items-end justify-between gap-2 sm:gap-4">
        <div className="flex flex-col gap-2">
          <PowerUpBar powerups={hud.powerups} />
          <IngredientSlot ingredients={hud.ingredients} maxSlots={4} />
        </div>

        <div className="pixel-panel block px-2 py-1 sm:hidden">
          <ComboCounter hits={hud.combo.hits} multiplier={hud.combo.multiplier} score={hud.combo.score} />
        </div>

        <span className="pixel-panel hidden px-3 py-1 sm:inline-block">
          <span className="font-game text-xs text-white/90">
            WASD gerak - J ringan - K berat - L special - F ambil - Q buang - E masak
          </span>
        </span>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: scale(0.85); }
          15%  { opacity: 1; transform: scale(1); }
          80%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        @keyframes fadeOut {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
