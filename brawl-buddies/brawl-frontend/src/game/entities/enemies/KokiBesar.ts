import Phaser from 'phaser';
import BaseEnemy from './BaseEnemy';

/** Koki Besar — lambat, tanky, butuh heavy attack untuk stagger. */
export default class KokiBesar extends BaseEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 70,
      speed: 60,
      damage: 14,
      staggerThreshold: 45,
      tint: 0xa55eea,
      drop: '🍗',
      spriteId: 'koki-besar',
    }, 'tex-enemy-besar');
    this.setScale(1.1);
  }
}
