import Phaser from 'phaser';
import Player from '../Player';
import type { CharacterId } from './index';

/** LALA — Pastry Puncher. Special: "Sweet Barrage" (salvo projectile). */
export default class Lala extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'lala' as CharacterId);
  }

  specialRadius() {
    return 160;
  }
}
