import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from '../game/PhaserGame';
import HUD from '../components/HUD/HUD';
import PauseMenu from '../components/Menu/PauseMenu';
import WorldClearModal, { type WorldClearData } from '../components/Menu/WorldClearModal';
import MobileControls from '../components/Mobile/MobileControls';
import { useSaveData } from '../hooks/useSaveData';
import { EventBus } from '../game/EventBus';
import { usePlayerStore, LAST_WORLD } from '../store/usePlayerStore';
import { useGameStore } from '../store/useGameStore';
import { setTargetWorld } from '../game/targetWorld';
import type { CharacterId } from '../game/entities/characters';

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape' | 'portrait') => Promise<void>;
};

/** Halaman bermain: canvas Phaser + overlay HUD React. */
export default function GamePage() {
  const [paused, setPaused] = useState(false);
  const [worldClear, setWorldClear] = useState<WorldClearData | null>(null);
  const [needsLandscape, setNeedsLandscape] = useState(false);
  const gameShellRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const { saveScore } = useSaveData();
  const selectCharacter = usePlayerStore((s) => s.selectCharacter);
  const completeWorld = usePlayerStore((s) => s.completeWorld);
  const setSavedWorld = usePlayerStore((s) => s.setSavedWorld);
  const clearSavedRun = usePlayerStore((s) => s.clearSavedRun);
  const getStartWorld = usePlayerStore((s) => s.getStartWorld);

  // Terapkan start world saat halaman ini di-mount (sebelum CharacterSelectScene terbaca)
  useEffect(() => {
    setTargetWorld(getStartWorld());
  }, [getStartWorld]);

  useEffect(() => {
    const isTouch = () => 'ontouchstart' in window || window.matchMedia?.('(pointer: coarse)').matches === true;
    const isPortrait = () => window.innerHeight > window.innerWidth;
    const updateOrientationState = () => setNeedsLandscape(isTouch() && isPortrait());

    const tryLockLandscape = async () => {
      if (!isTouch()) return;
      try {
        await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
      } catch {
        updateOrientationState();
      }
    };

    updateOrientationState();
    void tryLockLandscape();
    window.addEventListener('resize', updateOrientationState);
    window.addEventListener('orientationchange', updateOrientationState);
    window.addEventListener('pointerdown', tryLockLandscape, { once: true });

    return () => {
      window.removeEventListener('resize', updateOrientationState);
      window.removeEventListener('orientationchange', updateOrientationState);
      window.removeEventListener('pointerdown', tryLockLandscape);
    };
  }, []);

  const handleEnterLandscape = async () => {
    try {
      await gameShellRef.current?.requestFullscreen?.();
      await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
    } catch {
      // Browser iOS/Safari sering menolak lock; overlay akan hilang setelah device diputar manual.
    } finally {
      setNeedsLandscape(window.innerHeight > window.innerWidth);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc hanya untuk pause biasa; saat modal World Clear terbuka, abaikan.
      if (e.key === 'Escape' && !worldClear) setPaused((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [worldClear]);

  // Freeze/unfreeze scene Phaser yang sedang aktif (bukan sekadar overlay).
  const hasPauseStateChanged = useRef(false);
  useEffect(() => {
    if (!hasPauseStateChanged.current) {
      hasPauseStateChanged.current = true;
      if (!paused) return;
    }

    EventBus.emit(paused ? 'game:pause' : 'game:resume');
  }, [paused]);

  // Boss kalah -> tampilkan modal World Clear.
  useEffect(() => {
    const onWorldClear = (data: WorldClearData) => setWorldClear(data);
    EventBus.on('world-clear', onWorldClear);
    return () => {
      EventBus.off('world-clear', onWorldClear);
    };
  }, []);

  // CharacterSelectScene -> sinkron ke Zustand store.
  useEffect(() => {
    const onCharSelected = (id: CharacterId) => selectCharacter(id);
    EventBus.on('character-selected', onCharSelected);
    return () => { EventBus.off('character-selected', onCharSelected); };
  }, [selectCharacter]);

  // GameOverScene -> kembali ke halaman utama React.
  useEffect(() => {
    const onGotoMenu = () => nav('/');
    EventBus.on('game:goto-menu', onGotoMenu);
    return () => {
      EventBus.off('game:goto-menu', onGotoMenu);
    };
  }, [nav]);

  const handleNext = () => {
    if (worldClear) {
      completeWorld(worldClear.world);
      saveScore(worldClear.score);
    }
    setWorldClear(null);
    EventBus.emit('world-clear:next');
  };
  const handleReselect = () => {
    if (worldClear) completeWorld(worldClear.world);
    setWorldClear(null);
    EventBus.emit('world-clear:reselect');
  };
  const handleSaveExit = async () => {
    if (worldClear) {
      completeWorld(worldClear.world);
      await saveScore(worldClear.score);
      setSavedWorld(Math.min(worldClear.world + 1, LAST_WORLD));
    }
    EventBus.emit('world-clear:save-exit');
    setWorldClear(null);
    nav('/');
  };

  const handlePauseRestart = () => {
    clearSavedRun();
    setTargetWorld(1);
    // Resume dulu secara synchronous agar scene sudah aktif sebelum plugin.start() dipanggil
    EventBus.emit('game:resume');
    setPaused(false);
    EventBus.emit('game:goto-char-select', { world: 1 });
  };

  const handlePauseSaveExit = () => {
    const currentWorld = useGameStore.getState().world;
    setSavedWorld(currentWorld);
    setPaused(false);
    EventBus.emit('game:resume');
    nav('/');
  };

  return (
    <div ref={gameShellRef} className="relative h-dvh w-dvw overflow-hidden bg-chaos-ink">
      <PhaserGame />
      <HUD onPause={() => setPaused(true)} />
      <MobileControls onPause={() => setPaused(true)} />
      {needsLandscape && (
        <div className="kitchen-screen fixed inset-0 z-[70] flex items-center justify-center px-6 text-center">
          <div className="chaos-card max-w-sm px-6 py-6">
            <div className="font-impact-game text-4xl leading-none text-[#2c1621] [text-shadow:2px_2px_0_#ffcf5a]">
              Putar Dapur
            </div>
            <p className="mt-3 font-game text-2xl leading-none text-[#351827]">
              HP harus landscape supaya kontrol tidak nutup arena.
            </p>
            <button
              onClick={handleEnterLandscape}
              className="chaos-button mt-5 w-full"
            >
              Masuk Landscape
            </button>
          </div>
        </div>
      )}
      <PauseMenu
        open={paused}
        onResume={() => setPaused(false)}
        onRestart={handlePauseRestart}
        onSaveExit={handlePauseSaveExit}
      />
      <WorldClearModal
        data={worldClear}
        onNext={handleNext}
        onReselect={handleReselect}
        onSaveExit={handleSaveExit}
      />
    </div>
  );
}
