import Phaser from 'phaser';
import BaseEnemy from './BaseEnemy';

/** Koki Bom — mengejar cepat, meledak (AOE) saat dekat pemain. */
export default class KokiBom extends BaseEnemy {
  private fuse = -1;
  private ring?: Phaser.GameObjects.Graphics;
  private readonly blastRadius = 120;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 16,
      speed: 150,
      damage: 28,
      staggerThreshold: 12,
      tint: 0x2ed573,
      drop: '🌶️',
      spriteId: 'koki-bom',
    }, 'tex-enemy-bom');
  }

  protected decideMove(target: Phaser.Math.Vector2) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
    // mulai sumbu ledak saat sangat dekat
    if (dist < 70 && this.fuse < 0) {
      this.fuse = 600;
      this.setTintFill(0xffffff);
    }
    return super.decideMove(target);
  }

  /** @returns true bila meledak frame ini (GameScene tangani AOE damage). */
  tickFuse(delta: number): boolean {
    if (this.fuse < 0) return false;
    this.fuse -= delta;
    this.setScale(1 + (600 - this.fuse) / 600);

    // Telegraph zona bahaya: cincin merah berkedip seukuran radius ledakan,
    // memberi pemain isyarat jelas untuk menjauh sebelum DUAR.
    if (!this.ring) this.ring = this.scene.add.graphics().setDepth(4);
    const pulse = 0.25 + 0.35 * Math.abs(Math.sin(this.fuse / 55));
    this.ring
      .clear()
      .fillStyle(0xff4757, pulse)
      .fillCircle(this.x, this.y, this.blastRadius)
      .lineStyle(3, 0xffffff, 0.9)
      .strokeCircle(this.x, this.y, this.blastRadius);

    return this.fuse <= 0;
  }

  destroy(fromScene?: boolean) {
    this.ring?.destroy();
    super.destroy(fromScene);
  }
}
