import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';
import AudioManager from '../../../systems/AudioManager';

/**
 * Boss World 2 — scan barcode jadi laser horizontal + lempar belanjaan.
 * Pola: tiap ~2.8 dtk pilih salah satu dari dua serangan:
 *   a) Laser barcode: telegraf garis di atas posisi pemain, lalu menyapu sinar
 *      satu layar (damage jika pemain berada di baris yang sama saat lewat).
 *   b) Lempar belanjaan: proyektil melengkung ke posisi target, damage saat mendarat.
 */
export default class KasirMutan extends BaseEnemy {
  readonly maxHp = 480;
  private specialTimer = 2800;
  private laserFx?: Phaser.GameObjects.Rectangle;
  private laserTelegraph?: Phaser.GameObjects.Rectangle;
  private lastTarget = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 480,
      speed: 90,
      damage: 22,
      staggerThreshold: 120,
      tint: 0x70a1ff,
      drop: '🧅',
      spriteId: 'kasir-mutan',
      attackCooldownMs: 1100,
      attackWindupMs: 340,
      attackDurationMs: 680,
      attackLunge: 30,
    });
    this.setScale(1.6);
    this.setOrigin(0.5, 0.9);
  }

  override tick(delta: number, target: Phaser.Math.Vector2) {
    this.lastTarget.copy(target);
    if (this.animState === 'dead') return;
    if (this.isStaggered || this.frozen) {
      this.specialTimer = Math.max(this.specialTimer, 1000);
      super.tick(delta, target);
      return;
    }

    if (this.animState !== 'attack') super.tick(delta, target);

    // Jangan mulai serangan khusus saat sedang menyerang dasar agar tidak overlap.
    if (this.animState === 'attack') {
      this.specialTimer = Math.max(this.specialTimer, 600);
      return;
    }

    this.specialTimer -= delta;
    if (this.specialTimer <= 0) {
      this.specialTimer = 2800;
      if (Math.random() < 0.5) this.laserScan();
      else this.throwGroceries();
    }
  }

  /** 50%: laser barcode menyapu baris horizontal di posisi pemain saat menembak. */
  private laserScan() {
    if (this.animState === 'dead') return;
    // Bungkus target di titik telegraf, bukan posisi live (agar jujur terhadap telegraf).
    const y = Phaser.Math.Clamp(this.lastTarget.y, 60, this.scene.scale.height - 60);
    this.setVelocity(0, 0);

    // Telegraf garis merah tipis di baris target.
    this.laserTelegraph = this.scene.add
      .rectangle(this.scene.scale.width / 2, y, this.scene.scale.width, 6, 0xff4c55, 0.55)
      .setDepth(6);
    this.scene.tweens.add({
      targets: this.laserTelegraph,
      alpha: { from: 0.1, to: 0.8 },
      duration: 500,
      yoyo: true,
      repeat: 1,
    });

    this.scene.time.delayedCall(600, () => {
      this.laserTelegraph?.destroy();
      this.laserTelegraph = undefined;
      if (this.animState === 'dead') return;
      // Sinar penuh menyala sesaat.
      this.laserFx = this.scene.add
        .rectangle(this.scene.scale.width / 2, y, this.scene.scale.width, 10, 0xff9f1a, 0.9)
        .setDepth(6);
      AudioManager.sfx('hit-special', 0.7);

      this.scene.time.delayedCall(350, () => {
        this.laserFx?.destroy();
        this.laserFx = undefined;
        if (this.animState === 'attack') {
          this.animState = 'idle';
          this.playEnemyAnim('idle');
        }
      });

      if (!this.onHitPlayer) return;
      // Damage jika pemain masih berada di baris yang sama saat sinar aktif.
      const liveY = this.lastTarget.y;
      if (Math.abs(liveY - y) < 55) this.onHitPlayer(this.cfg.damage * 0.9);
    });
  }

  /** 50%: lempar belanjaan melengkung ke posisi target saat lempar. */
  private throwGroceries() {
    if (this.animState === 'dead') return;
    this.setVelocity(0, 0);
    const impactX = Phaser.Math.Clamp(this.lastTarget.x, 80, this.scene.scale.width - 80);
    const impactY = Phaser.Math.Clamp(this.lastTarget.y + 20, 80, this.scene.scale.height - 40);

    const proj = this.scene.add
      .circle(this.x, this.y - 40, 12, 0xffa502, 1)
      .setStrokeStyle(3, 0x2c1621, 1)
      .setDepth(6);

    this.scene.tweens.add({
      targets: proj,
      x: impactX,
      y: impactY,
      duration: 750,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        AudioManager.sfx('explosion', 0.5);
        const burst = this.scene.add.circle(impactX, impactY, 10, 0xffa502, 0.8).setDepth(6);
        this.scene.tweens.add({ targets: burst, scale: 4, alpha: 0, duration: 250, onComplete: () => burst.destroy() });
        proj.destroy();
        // Damage area kecil di titik pendaratan jika pemain berada di dekatnya.
        if (!this.onHitPlayer) return;
        const live = this.lastTarget;
        if (Phaser.Math.Distance.Between(impactX, impactY, live.x, live.y) < 90) {
          this.onHitPlayer(this.cfg.damage * 0.7);
        }
      },
    });
  }

  override destroy(fromScene?: boolean) {
    this.laserFx?.destroy();
    this.laserTelegraph?.destroy();
    this.lastTarget.set(0, 0);
    super.destroy(fromScene);
  }
}