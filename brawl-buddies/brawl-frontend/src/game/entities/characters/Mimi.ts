import Phaser from 'phaser';
import Player from '../Player';
import type { CharacterId } from './index';

/** MIMI — Noodle Master. Special: "Noodle Whirlwind" (AOE putar). */
export default class Mimi extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mimi' as CharacterId);
  }

  /** Radius AOE special — luas karena combo-oriented. */
  specialRadius() {
    return 180;
  }
}
