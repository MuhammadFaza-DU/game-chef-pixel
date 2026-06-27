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

/** Halaman bermain: canvas Phaser + overlay HUD React. */
export default function GamePage() {
  const [paused, setPaused] = useState(false);
  const [worldClear, setWorldClear] = useState<WorldClearData | null>(null);
  const nav = useNavigate();
  const { saveScore } = useSaveData();
  const selectCharacter = usePlayerStore((s) => s.selectCharacter);
  const completeWorld = usePlayerStore((s) => s.completeWorld);
  const setSavedWorld = usePlayerStore((s) => s.setSavedWorld);
  const savedWorld = usePlayerStore((s) => s.savedWorld);

  // Terapkan savedWorld ke targetWorld saat halaman ini di-mount (sebelum CharacterSelectScene terbaca)
  useEffect(() => {
    setTargetWorld(savedWorld ?? 1);
  }, [savedWorld]);

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
    const currentWorld = useGameStore.getState().world;
    // Resume dulu secara synchronous agar scene sudah aktif sebelum plugin.start() dipanggil
    EventBus.emit('game:resume');
    setPaused(false);
    EventBus.emit('game:goto-char-select', { world: currentWorld });
  };

  const handlePauseSaveExit = () => {
    const currentWorld = useGameStore.getState().world;
    setSavedWorld(currentWorld);
    setPaused(false);
    EventBus.emit('game:resume');
    nav('/');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-chaos-ink">
      <PhaserGame />
      <HUD onPause={() => setPaused(true)} />
      <MobileControls onPause={() => setPaused(true)} />
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
