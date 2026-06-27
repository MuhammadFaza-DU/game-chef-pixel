import Phaser from 'phaser';
import BaseEnemy from './BaseEnemy';

/** Koki Biasa — jalan lurus ke pemain, kalah 3 pukulan ringan. */
export default class KokiBiasa extends BaseEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 24,
      speed: 110,
      damage: 6,
      staggerThreshold: 18,
      tint: 0xff4757,
      drop: '🍅',
      spriteId: 'koki-biasa',
    });
    this.setScale(0.9);
  }
}
