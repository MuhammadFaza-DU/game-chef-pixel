import Phaser from 'phaser';
import BaseEnemy from '../BaseEnemy';
import AudioManager from '../../../systems/AudioManager';

/**
 * Boss World 3 — dua boss (besar + kecil) saling oper senjata.
 * Pola: salah satu membawa "wajan" (armed) dan bergerak lebih agresif;
 * setiap ~4 dtk mereka saling oper (tukar peran) dengan kilatan visual.
 * Boss yang tidak memegang wajan cenderung menjaga jarak (menjauh dari pemain).
 */
export default class DuoMCMakan extends BaseEnemy {
  readonly maxHp = 360;
  private variant: 'besar' | 'kecil';
  private partner: DuoMCMakan | null = null;
  private armed = false;
  private swapTimer = 4000;
  private knockFx?: Phaser.GameObjects.Arc;
  private lastTarget = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, x: number, y: number, variant: 'besar' | 'kecil' = 'besar') {
    super(scene, x, y, {
      hp: variant === 'besar' ? 360 : 200,
      speed: variant === 'besar' ? 80 : 170,
      damage: variant === 'besar' ? 24 : 12,
      staggerThreshold: 100,
      tint: variant === 'besar' ? 0xff6348 : 0xffb8b8,
      drop: '🌶️',
      spriteId: variant === 'besar' ? 'duo-mc-besar' : 'duo-mc-kecil',
      attackCooldownMs: variant === 'besar' ? 1200 : 760,
      attackWindupMs: variant === 'besar' ? 360 : 220,
      attackDurationMs: variant === 'besar' ? 700 : 440,
      attackLunge: variant === 'besar' ? 32 : 22,
    });
    this.variant = variant;
    this.setScale(variant === 'besar' ? 1.7 : 1.1);
    this.setOrigin(0.5, 0.9);
  }

  /** Hubungkan pasangan (dipanggil BossScene setelah kedua instance dibuat). */
  setPartner(p: DuoMCMakan) {
    this.partner = p;
  }

  get isArmed() {
    return this.armed;
  }

  /** Tandai pemegang wajan. Bos besar mulai memegang wajan. */
  setArmed(armed: boolean) {
    this.armed = armed;
    if (armed) this.setTintFill(0xffe08a);
    else this.clearTint();
  }

  override tick(delta: number, target: Phaser.Math.Vector2) {
    this.lastTarget.copy(target);
    if (this.animState === 'dead') return;

    // Koordinasi oper senjata dijalankan hanya oleh instance yang sudah punya partner
    // (hindari kedua instance menjalankan swap ganda/doa).
    if (this.partner && this === this.partner.partner) {
      this.swapTimer -= delta;
      if (this.swapTimer <= 0) {
        this.swapTimer = 4000;
        const other = this.partner;
        this.setArmed(false);
        other.setArmed(true);
        AudioManager.sfx('hit-heavy', 0.7);
        const midX = (this.x + other.x) / 2;
        const midY = (this.y + other.y) / 2;
        const flash = this.scene.add.circle(midX, midY, 16, 0xffe08a, 0.9).setDepth(6);
        this.scene.tweens.add({ targets: flash, scale: 6, alpha: 0, duration: 300, onComplete: () => flash.destroy() });
      }
    }

    if (this.isStaggered || this.frozen) {
      super.tick(delta, target);
      return;
    }

    if (this.armed) {
      // Pemegang wajan mengejar agresif + sesekali lempar wajan (projectile).
      const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
      if (dist < 420 && Math.random() < 0.004) this.throwWok();
      super.tick(delta, target);
    } else {
      // Tanpa wajan: jaga jarak (menjauh pelan) + mundur dari pemain.
      const dir = new Phaser.Math.Vector2(this.x - target.x, this.y - target.y).normalize();
      const retreatSpeed = this.variant === 'kecil' ? 90 : 50;
      this.setVelocity(dir.x * retreatSpeed, dir.y * retreatSpeed);
      const moving = dir.length() > 0;
      const next: 'run' | 'idle' = moving ? 'run' : 'idle';
      if (this.animState !== 'attack' && this.animState !== next) {
        this.animState = next;
        this.playEnemyAnim(next as 'run' | 'idle');
      }
    }
  }

  /** Lempar wajan — projectile melengkung ke target, damage di titik pendaratan. */
  private throwWok() {
    if (this.animState === 'dead') return;
    const tx = Phaser.Math.Clamp(this.lastTarget.x, 80, this.scene.scale.width - 80);
    const ty = Phaser.Math.Clamp(this.lastTarget.y - 20, 60, this.scene.scale.height - 40);

    const wok = this.scene.add
      .circle(this.x, this.y - 60, 18, 0xffe08a, 1)
      .setStrokeStyle(4, 0x2c1621, 1)
      .setDepth(6);

    this.scene.tweens.add({
      targets: wok,
      x: tx,
      y: ty,
      angle: 720,
      duration: 700,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        wok.destroy();
        AudioManager.sfx('hit-special', 0.7);
        const boom = this.scene.add.circle(tx, ty, 14, 0xffe08a, 0.8).setDepth(6);
        this.scene.tweens.add({ targets: boom, scale: 4, alpha: 0, duration: 260, onComplete: () => boom.destroy() });
        if (!this.onHitPlayer) return;
        if (Phaser.Math.Distance.Between(tx, ty, this.lastTarget.x, this.lastTarget.y) < 100) {
          this.onHitPlayer(this.cfg.damage * 0.8);
        }
      },
    });
  }

  override destroy(fromScene?: boolean) {
    this.knockFx?.destroy();
    this.lastTarget.set(0, 0);
    super.destroy(fromScene);
  }
}