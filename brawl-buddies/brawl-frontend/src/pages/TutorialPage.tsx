import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from '../game/PhaserGame';
import { EventBus } from '../game/EventBus';
import { setTargetWorld } from '../game/targetWorld';
import { usePlayerStore } from '../store/usePlayerStore';
import { setTutorialMode } from '../game/tutorialMode';
import StartRunChoiceModal from '../components/Menu/StartRunChoiceModal';

/** Halaman tutorial — hanya canvas Phaser tanpa HUD React overlay. */
export default function TutorialPage() {
  const nav = useNavigate();
  const savedWorld = usePlayerStore((s) => s.savedWorld);
  const getStartWorld = usePlayerStore((s) => s.getStartWorld);
  const clearSavedRun = usePlayerStore((s) => s.clearSavedRun);
  const [showStartChoice, setShowStartChoice] = useState(false);

  const startFromWorld = useCallback((world: number) => {
    setTutorialMode(false);
    setTargetWorld(world);
    nav('/play');
  }, [nav]);

  useEffect(() => {
    const onGotoPlay = () => {
      if (usePlayerStore.getState().hasSavedRun()) {
        setShowStartChoice(true);
        return;
      }

      startFromWorld(1);
    };
    EventBus.on('tutorial:goto-play', onGotoPlay);
    return () => { EventBus.off('tutorial:goto-play', onGotoPlay); };
  }, [startFromWorld]);

  const handleContinue = () => {
    setShowStartChoice(false);
    startFromWorld(getStartWorld());
  };

  const handleNewGame = () => {
    clearSavedRun();
    setShowStartChoice(false);
    startFromWorld(1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-chaos-ink">
      <PhaserGame />
      <StartRunChoiceModal
        open={showStartChoice}
        savedWorld={savedWorld}
        onContinue={handleContinue}
        onNewGame={handleNewGame}
        onClose={() => setShowStartChoice(false)}
      />
    </div>
  );
}
