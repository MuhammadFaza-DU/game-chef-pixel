import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';
import AudioManager from '../../../systems/AudioManager';

/**
 * Boss World 1 — kecil, super cepat, suka sembunyi dalam panci.
 * Pola: tiap ~3.5 dtk sembunyi (invuln + teletransport) lalu muncul kembali
 * dengan gelombang pukulan ringan di sekelilingnya.
 */
export default class ChefRobotMicro extends BaseEnemy {
  readonly maxHp = 300;
  private specialTimer = 3500;
  private hiding = false;
  private hideTween?: Phaser.Tweens.Tween;
  private potShadow?: Phaser.GameObjects.Arc;
  private playerTarget = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 300,
      speed: 200,
      damage: 16,
      staggerThreshold: 90,
      tint: 0xeccc68,
      drop: '🍗',
      spriteId: 'chef-robot-micro',
      attackCooldownMs: 780,
      attackWindupMs: 230,
      attackDurationMs: 480,
      attackLunge: 24,
    });
    this.setScale(1.1);
    this.setOrigin(0.5, 0.9);
  }

  override tick(delta: number, target: Phaser.Math.Vector2) {
    this.playerTarget.copy(target);
    if (this.animState === 'dead') return;
    if (this.isStaggered || this.frozen) {
      this.specialTimer = Math.max(this.specialTimer, 1000);
      super.tick(delta, target);
      return;
    }

    if (this.hiding) {
      this.setVelocity(0, 0);
      return; // sedang sembunyi — tidak bergerak/menyerang, invulnerable.
    }

    super.tick(delta, target);

    this.specialTimer -= delta;
    if (this.specialTimer <= 0) {
      this.specialTimer = 3500;
      this.hideInPot();
    }
  }

  /** Sembunyi dalam panci: invuln, teleport ke titik acak, lalu muncul dengan ring pukulan. */
  private hideInPot() {
    if (this.hiding || this.animState === 'dead') return;
    this.hiding = true;
    this.setInvulnerable(true);
    this.setVelocity(0, 0);
    this.cancelAttack();
    this.setAlpha(0.35);

    // Bayangan pot menandai lokasi sembunyi.
    const w = this.displayWidth * 1.5;
    this.potShadow = this.scene.add
      .circle(this.x, this.y + 6, w / 2, 0x000000, 0.4)
      .setScale(1, 0.32)
      .setDepth(1);

    this.scene.cameras.main.shake(150, 0.004);
    AudioManager.sfx('hit-heavy', 0.6);

    const toX = Phaser.Math.Between(140, this.scene.scale.width - 140);
    const toY = Phaser.Math.Between(140, this.scene.scale.height - 160);

    this.hideTween = this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      duration: 900,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        this.setAlpha(1);
        this.setInvulnerable(false);
        this.hiding = false;
        this.potShadow?.destroy();
        this.potShadow = undefined;
        this.emergedRing();
        // Sedikit kecepatan ekstra setelah muncul memberi kesan "pantul".
        this.specialTimer = 2600;
      },
    });
  }

  private emergedRing() {
    if (this.animState === 'dead') return;
    const r = this.scene.add.circle(this.x, this.y, 24, 0xffeaa7, 0.7).setDepth(5);
    this.scene.tweens.add({
      targets: r,
      scale: 5,
      alpha: 0,
      duration: 420,
      onComplete: () => r.destroy(),
    });
    // Pukulan ringan: damage ke player jika masih dekat saat ring melebar.
    if (!this.onHitPlayer) return;
    this.scene.time.delayedCall(200, () => {
      if (this.animState === 'dead') return;
      if (Phaser.Math.Distance.Between(this.x, this.y, this.playerTarget.x, this.playerTarget.y) < 150) {
        this.onHitPlayer!(this.cfg.damage * 0.7);
      }
    });
  }

  override destroy(fromScene?: boolean) {
    this.hideTween?.remove();
    this.potShadow?.destroy();
    this.playerTarget.set(0, 0);
    super.destroy(fromScene);
  }
}