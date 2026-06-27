import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';

/** Boss World 1 — kecil, super cepat, suka sembunyi dalam panci. */
export default class ChefRobotMicro extends BaseEnemy {
  readonly maxHp = 300;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 300,
      speed: 200,
      damage: 16,
      staggerThreshold: 90,
      tint: 0xeccc68,
      drop: '🍗',
      spriteId: 'chef-robot-micro',
    });
    this.setScale(1.1);
  }

  // TODO: implement fase "sembunyi dalam panci" (invuln + reposition).
}
