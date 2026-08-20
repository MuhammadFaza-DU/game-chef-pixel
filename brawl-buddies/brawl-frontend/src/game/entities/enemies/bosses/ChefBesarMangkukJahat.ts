import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';
import AudioManager from '../../../systems/AudioManager';

/**
 * Final Boss World 4 — multi-phase, 3 fase transformasi makin absurd.
 * Pola per fase:
 *   Fase 1: serangan dasar + lempar mangkuk (projectile arc).
 *   Fase 2: + shockwave melingkar menyebar dari boss (jauhi boss!).
 *   Fase 3: + hujan piring (parabola dari atas), boss lebih cepat & mempan teleport.
 */
export default class ChefBesarMangkukJahat extends BaseEnemy {
  readonly maxHp = 900;
  phase: 1 | 2 | 3 = 1;
  private phaseTimer = 2600;
  private lastTarget = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      hp: 900,
      speed: 70,
      damage: 30,
      staggerThreshold: 200,
      tint: 0x5f27cd,
      drop: '🍳',
      spriteId: 'chef-besar',
      attackCooldownMs: 1300,
      attackWindupMs: 430,
      attackDurationMs: 760,
      attackLunge: 36,
    });
    this.setScale(2);
    this.setOrigin(0.5, 0.9);
  }

  /** Naik fase saat HP melewati ambang. */
  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const next: 1 | 2 | 3 = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    if (next !== this.phase) {
      this.phase = next;
      this.cfg.speed += 25;
      this.cfg.damage += 8;
      this.setScale(2 + (this.phase - 1) * 0.15);
      this.scene.cameras.main.flash(300, 95, 39, 205);
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 0.2, to: 1 },
        duration: 600,
      });
    }
  }

  override tick(delta: number, target: Phaser.Math.Vector2) {
    this.lastTarget.copy(target);
    if (this.animState === 'dead') return;
    if (this.isStaggered || this.frozen) {
      this.phaseTimer = Math.max(this.phaseTimer, 800);
      super.tick(delta, target);
      return;
    }

    if (this.animState !== 'attack') super.tick(delta, target);
    if (this.animState === 'attack') {
      this.phaseTimer = Math.max(this.phaseTimer, 600);
      return;
    }

    this.phaseTimer -= delta;
    if (this.phaseTimer <= 0) {
      // Interval pola naik seiring fase agar makin intens.
      this.phaseTimer = this.phase === 1 ? 2600 : this.phase === 2 ? 2000 : 1500;
      this.phaseAttack();
    }
  }

  private phaseAttack() {
    if (this.phase === 1) {
      this.throwBowl();
    } else if (this.phase === 2) {
      this.shockwave();
    } else {
      this.plateRain();
      if (Math.random() < 0.4) this.teleportPounce();
    }
  }

  /** Lempar mangkuk besar ke target (fase 1). */
  private throwBowl() {
    this.animState = 'attack';
    this.playEnemyAttack();
    const tx = Phaser.Math.Clamp(this.lastTarget.x, 100, this.scene.scale.width - 100);
    const ty = Phaser.Math.Clamp(this.lastTarget.y - 10, 80, this.scene.scale.height - 60);

    const bowl = this.scene.add
      .circle(this.x, this.y - 90, 22, 0x5f27cd, 1)
      .setStrokeStyle(4, 0xffffff, 0.8)
      .setDepth(6);

    this.scene.tweens.add({
      targets: bowl,
      x: tx,
      y: ty,
      angle: 540,
      duration: 800,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        bowl.destroy();
        AudioManager.sfx('hit-special', 0.6);
        const boom = this.scene.add.circle(tx, ty, 18, 0x5f27cd, 0.8).setDepth(6);
        this.scene.tweens.add({ targets: boom, scale: 4, alpha: 0, duration: 240, onComplete: () => boom.destroy() });
        if (!this.onHitPlayer) return;
        if (Phaser.Math.Distance.Between(tx, ty, this.lastTarget.x, this.lastTarget.y) < 100) {
          this.onHitPlayer(this.cfg.damage * 0.7);
        }
        if (this.animState === 'attack') {
          this.animState = 'idle';
          this.playEnemyAnim('idle');
        }
      },
    });
  }

  /** Shockwave melingkar menyebar dari boss — jauhi boss saat ring keluar. */
  private shockwave() {
    this.animState = 'attack';
    this.playEnemyAttack();
    AudioManager.sfx('explosion', 0.7);
    this.scene.cameras.main.shake(200, 0.008);

    const ring = this.scene.add.circle(this.x, this.y, 20, 0x9c88ff, 0.6).setDepth(6);
    const maxR = Math.max(this.scene.scale.width, this.scene.scale.height) * 0.85;

    this.scene.tweens.add({
      targets: ring,
      radius: maxR,
      alpha: 0,
      duration: 700,
      onUpdate: () => {
        // Damage dikirim di titik waktu ring melewati posisi pemain.
        if (!this.onHitPlayer) return;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.lastTarget.x, this.lastTarget.y);
        if (Math.abs(dist - ring.radius) < 34) {
          this.onHitPlayer(this.cfg.damage * 0.8);
        }
      },
    });
    this.scene.time.delayedCall(700, () => ring.destroy());
  }

  /** Hujan piring: beberapa parabola dari atas ke fitur pemain (fase 3). */
  private plateRain() {
    for (let i = 0; i < 3; i++) {
      const delay = i * 220;
      this.scene.time.delayedCall(delay, () => {
        if (this.animState === 'dead') return;
        const tx = Phaser.Math.Clamp(this.lastTarget.x + Phaser.Math.Between(-90, 90), 70, this.scene.scale.width - 70);
        const plate = this.scene.add
          .circle(tx, -30, 14, 0xdfd9ff, 1)
          .setStrokeStyle(3, 0x5f27cd, 1)
          .setDepth(6);

        // Munculan bayangan target di lantai sebagai telegraf.
        const mark = this.scene.add.circle(tx, this.scene.scale.height - 40, 22, 0x5f27cd, 0.25).setDepth(5);

        this.scene.tweens.add({
          targets: plate,
          y: this.scene.scale.height - 30,
          duration: 800,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            plate.destroy();
            mark.destroy();
            AudioManager.sfx('hit-heavy', 0.5);
            const burst = this.scene.add.circle(tx, this.scene.scale.height - 30, 10, 0xdfd9ff, 0.8).setDepth(6);
            this.scene.tweens.add({ targets: burst, scale: 3, alpha: 0, duration: 200, onComplete: () => burst.destroy() });
            if (!this.onHitPlayer) return;
            if (Phaser.Math.Distance.Between(tx, this.scene.scale.height - 30, this.lastTarget.x, this.lastTarget.y) < 80) {
              this.onHitPlayer(this.cfg.damage * 0.6);
            }
          },
        });
      });
    }
  }

  /** Teleport pounce singkat ke arah pemain (fase 3). */
  private teleportPounce() {
    this.setInvulnerable(true);
    this.setAlpha(0.3);
    this.scene.cameras.main.flash(120, 95, 39, 205);

    const toX = Phaser.Math.Clamp(this.lastTarget.x + Phaser.Math.Between(-140, 60), 120, this.scene.scale.width - 120);
    const toY = Phaser.Math.Clamp(this.lastTarget.y - 40, 100, this.scene.scale.height - 120);

    this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      duration: 350,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        this.setAlpha(1);
        this.setInvulnerable(false);
        AudioManager.sfx('hit-heavy', 0.7);
        const ring = this.scene.add.circle(this.x, this.y, 20, 0x9c88ff, 0.7).setDepth(6);
        this.scene.tweens.add({ targets: ring, scale: 3, alpha: 0, duration: 300, onComplete: () => ring.destroy() });
        if (!this.onHitPlayer) return;
        if (Phaser.Math.Distance.Between(this.x, this.y, this.lastTarget.x, this.lastTarget.y) < 130) {
          this.onHitPlayer(this.cfg.damage * 0.9);
        }
      },
    });
  }

  override destroy(fromScene?: boolean) {
    this.lastTarget.set(0, 0);
    super.destroy(fromScene);
  }
}