import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from '../game/PhaserGame';
import { EventBus } from '../game/EventBus';
import { setTargetWorld } from '../game/targetWorld';
import { usePlayerStore } from '../store/usePlayerStore';

/** Halaman tutorial — hanya canvas Phaser tanpa HUD React overlay. */
export default function TutorialPage() {
  const nav = useNavigate();

  useEffect(() => {
    const onGotoPlay = () => {
      setTargetWorld(1);
      usePlayerStore.getState().setSavedWorld(null);
      nav('/play');
    };
    EventBus.on('tutorial:goto-play', onGotoPlay);
    return () => { EventBus.off('tutorial:goto-play', onGotoPlay); };
  }, [nav]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-chaos-ink">
      <PhaserGame />
    </div>
  );
}
