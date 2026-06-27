import Phaser from 'phaser';
import Player from '../Player';
import type { CharacterId } from './index';

/** BOBO — Grill King. Special: "MEGA BAKAR!" (slam + api ke segala arah). */
export default class Bobo extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bobo' as CharacterId);
  }

  specialRadius() {
    return 220; // slam besar, tank
  }
}
