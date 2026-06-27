import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';

const CONTAINER_ID = 'game-canvas';

/** Wrapper React yang me-mount instance Phaser tepat sekali. */
export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return; // cegah double-mount (StrictMode)
    gameRef.current = new Phaser.Game(createGameConfig(CONTAINER_ID));

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id={CONTAINER_ID} className="w-full h-full" />;
}
