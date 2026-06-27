import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';

/** Boss World 3 — dua boss (besar + kecil) saling oper senjata. */
export default class DuoMCMakan extends BaseEnemy {
  readonly maxHp = 360;

  constructor(scene: Phaser.Scene, x: number, y: number, variant: 'besar' | 'kecil' = 'besar') {
    super(scene, x, y, {
      hp: variant === 'besar' ? 360 : 200,
      speed: variant === 'besar' ? 80 : 170,
      damage: variant === 'besar' ? 24 : 12,
      staggerThreshold: 100,
      tint: variant === 'besar' ? 0xff6348 : 0xffb8b8,
      drop: '🌶️',
      spriteId: variant === 'besar' ? 'duo-mc-besar' : 'duo-mc-kecil',
    });
    this.setScale(variant === 'besar' ? 1.7 : 1.1);
  }

  // TODO: koordinasi "oper senjata" antar dua instance.
}
