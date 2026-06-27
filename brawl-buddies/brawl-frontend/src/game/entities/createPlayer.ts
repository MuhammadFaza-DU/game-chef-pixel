import Phaser from 'phaser';
import type { CharacterId } from './characters';
import Player from './Player';
import Mimi from './characters/Mimi';
import Bobo from './characters/Bobo';
import Lala from './characters/Lala';

/** Factory: instansiasi subclass character yang tepat. */
export function createPlayer(scene: Phaser.Scene, x: number, y: number, id: CharacterId): Player {
  switch (id) {
    case 'mimi':
      return new Mimi(scene, x, y);
    case 'bobo':
      return new Bobo(scene, x, y);
    case 'lala':
      return new Lala(scene, x, y);
    default:
      return new Player(scene, x, y, id);
  }
}
