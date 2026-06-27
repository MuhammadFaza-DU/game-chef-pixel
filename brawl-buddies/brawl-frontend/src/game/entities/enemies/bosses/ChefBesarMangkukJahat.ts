import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';

/** Final Boss World 4 — multi-phase, 3 fase transformasi makin absurd. */
export default class ChefBesarMangkukJahat extends BaseEnemy {
  readonly maxHp = 900;
  phase: 1 | 2 | 3 = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 900,
      speed: 70,
      damage: 30,
      staggerThreshold: 200,
      tint: 0x5f27cd,
      drop: '🍳',
      spriteId: 'chef-besar',
    });
    this.setScale(2);
  }

  /** Naik fase saat HP melewati ambang. */
  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const next: 1 | 2 | 3 = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    if (next !== this.phase) {
      this.phase = next;
      this.cfg.speed += 25;
      this.cfg.damage += 8;
      this.scene.cameras.main.flash(300, 95, 39, 205);
    }
  }

  // TODO: pola serangan unik per fase.
}
