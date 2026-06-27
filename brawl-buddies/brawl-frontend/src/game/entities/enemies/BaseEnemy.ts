import Phaser from 'phaser';
import { sheetKey } from '../../utils/AnimationRegistry';
import type { AnimKey } from '../../sprites/spriteConfig';
import AudioManager from '../../systems/AudioManager';

export interface EnemyConfig {
  hp: number;
  speed: number;
  damage: number;
  staggerThreshold: number;
  tint: number;
  drop: string;
  /** ID sprite dari ENEMY_SPRITES (mis. 'koki-biasa'). Kosongkan = pakai placeholder. */
  spriteId?: string;
}

type EnemyAnimState = 'idle' | 'run' | 'hurt' | 'dead';

/**
 * Musuh dasar. Mengejar target terdekat, menyerang saat kontak.
 * Mendukung dua mode visual:
 *   - hasSprite=true  → animasi LuizMelo spritesheet
 *   - hasSprite=false → siluet placeholder + tint (fallback)
 */
export default class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  cfg: EnemyConfig;
  hp: number;
  isStaggered = false;
  readonly hasSprite: boolean;

  private attackTimer = 0;
  private recentDamage = 0;
  private hpBar: Phaser.GameObjects.Graphics;
  private animState: EnemyAnimState = 'idle';
  private isFrozen = false;
  private freezeRemaining = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: EnemyConfig, fallbackTexKey = 'tex-enemy') {
    // Cek sprite sebelum super — boleh karena tidak pakai `this`
    const idleKey = cfg.spriteId ? sheetKey(cfg.spriteId, 'idle') : null;
    const hasSprite = idleKey ? scene.textures.exists(idleKey) : false;
    super(scene, x, y, hasSprite && idleKey ? idleKey : fallbackTexKey);

    this.cfg = cfg;
    this.hp = cfg.hp;
    this.hasSprite = hasSprite;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    if (hasSprite) {
      this.playEnemyAnim('idle');
    } else {
      this.setTint(cfg.tint);
    }

    this.hpBar = scene.add.graphics().setDepth(8);
  }

  /** Gambar ulang bar HP di atas kepala (hijau→kuning→merah). */
  private drawHpBar() {
    const w = Math.max(34, this.displayWidth * 0.7);
    const h = 6;
    const ratio = Phaser.Math.Clamp(this.hp / this.cfg.hp, 0, 1);
    const top = this.y - this.displayHeight / 2 - 14;
    const left = this.x - w / 2;
    const color = ratio > 0.5 ? 0x2ed573 : ratio > 0.25 ? 0xffd93d : 0xff4757;

    this.hpBar
      .clear()
      .fillStyle(0x000000, 0.55)
      .fillRect(left - 1, top - 1, w + 2, h + 2)
      .fillStyle(color, 1)
      .fillRect(left, top, w * ratio, h);
  }

  /** Override di subclass untuk pola gerak berbeda. */
  protected decideMove(target: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    const dir = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).normalize();
    return dir.scale(this.cfg.speed);
  }

  tick(delta: number, target: Phaser.Math.Vector2) {
    if (this.animState === 'dead') return;
    this.attackTimer = Math.max(0, this.attackTimer - delta);
    this.recentDamage = Math.max(0, this.recentDamage - delta * 0.05);
    this.drawHpBar();

    // Freeze countdown — musuh beku tidak bisa bergerak atau stagger
    if (this.isFrozen) {
      this.freezeRemaining -= delta;
      if (this.freezeRemaining <= 0) {
        this.unfreeze();
      } else {
        this.setVelocity(0, 0);
        return;
      }
    }

    if (this.isStaggered) {
      this.setVelocity(0, 0);
      if (this.animState !== 'hurt') {
        this.animState = 'hurt';
        this.playEnemyAnim('hurt');
      }
      return;
    }

    const vel = this.decideMove(target);
    this.setVelocity(vel.x, vel.y);
    this.setFlipX(vel.x < 0);

    const moving = vel.length() > 0;
    const next: EnemyAnimState = moving ? 'run' : 'idle';
    if (this.animState !== next) {
      this.animState = next;
      this.playEnemyAnim(next as 'idle' | 'run');
    }
  }

  /** Bekukan musuh selama `ms` milidetik. Memanggil ulang saat sudah beku = reset timer. */
  applyFreeze(ms: number) {
    this.isFrozen = true;
    this.freezeRemaining = ms;
    this.setTint(0x88ccff);
  }

  private unfreeze() {
    this.isFrozen = false;
    this.freezeRemaining = 0;
    if (this.hasSprite) {
      this.clearTint();
    } else {
      this.setTint(this.cfg.tint);
    }
  }

  /** @returns true jika musuh mati akibat hit ini. */
  takeDamage(amount: number): boolean {
    if (this.animState === 'dead') return true;
    this.hp -= amount;
    this.recentDamage += amount;

    if (!this.hasSprite) {
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(60, () => {
        if (this.isFrozen) this.setTint(0x88ccff);
        else this.setTint(this.cfg.tint);
      });
    }

    // Frozen musuh tidak bisa di-stagger
    if (!this.isFrozen && this.recentDamage >= this.cfg.staggerThreshold && !this.isStaggered) {
      this.triggerStagger();
    }

    if (this.hp <= 0) {
      this.animState = 'dead';
      this.playEnemyOnce('dead');
      AudioManager.sfx('enemy-die', 0.65);
    }

    return this.hp <= 0;
  }

  private triggerStagger() {
    this.isStaggered = true;
    this.setAngle(-8);
    this.scene.time.delayedCall(900, () => {
      this.isStaggered = false;
      this.recentDamage = 0;
      this.setAngle(0);
      if (this.animState === 'hurt') this.animState = 'idle';
    });
  }

  canAttack() {
    if (this.attackTimer > 0) return false;
    this.attackTimer = 900;
    return true;
  }

  destroy(fromScene?: boolean) {
    this.hpBar?.destroy();
    super.destroy(fromScene);
  }

  // ─── Animasi internal ──────────────────────────────────────────────────────

  private playEnemyAnim(state: 'idle' | 'run' | 'hurt') {
    if (!this.hasSprite || !this.cfg.spriteId) return;
    const key = sheetKey(this.cfg.spriteId, state);
    if (!this.scene.anims.exists(key)) return;
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }

  private playEnemyOnce(anim: AnimKey, onDone?: () => void) {
    if (!this.hasSprite || !this.cfg.spriteId) {
      onDone?.();
      return;
    }
    const key = sheetKey(this.cfg.spriteId, anim);
    if (!this.scene.anims.exists(key)) {
      onDone?.();
      return;
    }
    this.play(key);
    if (onDone) this.once(`animationcomplete-${key}`, onDone);
  }
}
