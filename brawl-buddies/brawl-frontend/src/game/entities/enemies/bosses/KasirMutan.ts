import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';

/** Boss World 2 — scan barcode jadi laser, lempar belanjaan. */
export default class KasirMutan extends BaseEnemy {
  readonly maxHp = 480;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 480,
      speed: 90,
      damage: 22,
      staggerThreshold: 120,
      tint: 0x70a1ff,
      drop: '🧅',
      spriteId: 'kasir-mutan',
    });
    this.setScale(1.6);
  }

  // TODO: serangan laser barcode (raycast horizontal) + lempar projectile.
}
