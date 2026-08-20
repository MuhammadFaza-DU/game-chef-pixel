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
  attackCooldownMs?: number;
  attackWindupMs?: number;
  attackDurationMs?: number;
  attackLunge?: number;
}

type EnemyAnimState = 'idle' | 'run' | 'attack' | 'hurt' | 'dead';

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
  /** Callback damage ke player untuk serangan khusus boss (laser, proyektil, dsb). Diisi BossScene. */
  onHitPlayer?: (damage: number) => void;

  private attackTimer = 0;
  private recentDamage = 0;
  private hpBar: Phaser.GameObjects.Graphics;
  protected animState: EnemyAnimState = 'idle';
  private isFrozen = false;
  private freezeRemaining = 0;
  private attackPhase: 1 | 2 = 1;
  private attackImpactEvent?: Phaser.Time.TimerEvent;
  private attackEndEvent?: Phaser.Time.TimerEvent;
  private knockbackTimer = 0;
  private knockbackVx = 0;
  private knockbackVy = 0;
  private invulnerable = false;

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
        this.cancelAttack();
        this.setVelocity(0, 0);
        return;
      }
    }

    if (this.isStaggered) {
      this.cancelAttack();
      this.setVelocity(0, 0);
      if (this.animState !== 'hurt') {
        this.animState = 'hurt';
        this.playEnemyAnim('hurt');
      }
      return;
    }

    // Knockback window: biar dorongan heavy/special terasa, jangan ditimpa
    // decideMove sebelum jendela knockback habis.
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= delta;
      this.setVelocity(this.knockbackVx, this.knockbackVy);
      return;
    }

    if (this.animState === 'attack') {
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

  /** Status beku (dipakai sistem lain untuk cek perilaku, mis. bom beku tak meledak). */
  get frozen() {
    return this.isFrozen;
  }

  /** Status kebal damage (boss saat bersembunyi/transformasi). */
  setInvulnerable(v: boolean) {
    this.invulnerable = v;
  }

  get isInvulnerable() {
    return this.invulnerable;
  }

  /** Terapkan dorongan knockback; gerak musuh terkunci sejenak agar dorongan terasa. */
  applyKnockback(vx: number, vy: number, duration = 160) {
    this.knockbackVx = vx;
    this.knockbackVy = vy;
    this.knockbackTimer = duration;
    this.setVelocity(vx, vy);
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
    if (this.invulnerable) return false;
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
    this.cancelAttack();
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

  startAttack(target: Phaser.Math.Vector2, range: number, onImpact: () => void): boolean {
    if (this.animState === 'dead' || this.animState === 'attack' || this.isFrozen || this.isStaggered) return false;
    if (this.attackTimer > 0) return false;

    const windup = this.cfg.attackWindupMs ?? this.getDefaultAttackWindup();
    const duration = this.cfg.attackDurationMs ?? Math.max(windup + 180, 520);
    const cooldown = this.cfg.attackCooldownMs ?? Math.max(duration + 360, 900);
    this.attackTimer = cooldown;
    this.animState = 'attack';

    const dir = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
    if (dir.lengthSq() > 0) dir.normalize();
    this.setFlipX(dir.x < 0);
    this.setVelocity(0, 0);
    this.playEnemyAttack();
    this.playAttackLunge(dir);

    this.attackImpactEvent = this.scene.time.delayedCall(windup, () => {
      if (!this.active || this.animState !== 'attack' || this.isFrozen || this.isStaggered || this.hp <= 0) return;
      if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= range) onImpact();
    });

    this.attackEndEvent = this.scene.time.delayedCall(duration, () => {
      if (!this.active || this.animState === 'dead') return;
      if (this.animState === 'attack') {
        this.animState = 'idle';
        this.playEnemyAnim('idle');
      }
    });

    return true;
  }

  destroy(fromScene?: boolean) {
    this.cancelAttack();
    this.hpBar?.destroy();
    super.destroy(fromScene);
  }

  // ─── Animasi internal ──────────────────────────────────────────────────────

  protected playEnemyAnim(state: 'idle' | 'run' | 'hurt') {
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

  protected playEnemyAttack() {
    const anim: AnimKey = this.attackPhase === 1 ? 'attack1' : 'attack2';
    this.attackPhase = this.attackPhase === 1 ? 2 : 1;

    if (!this.hasSprite || !this.cfg.spriteId) return;
    const key = sheetKey(this.cfg.spriteId, anim);
    const fallbackKey = sheetKey(this.cfg.spriteId, 'attack1');
    const attackKey = this.scene.anims.exists(key) ? key : fallbackKey;
    if (!this.scene.anims.exists(attackKey)) return;
    this.play(attackKey);
  }

  private playAttackLunge(dir: Phaser.Math.Vector2) {
    const distance = this.cfg.attackLunge ?? this.getDefaultAttackLunge();
    const fromX = this.x;
    const fromY = this.y;
    const toX = Phaser.Math.Clamp(fromX + dir.x * distance, 24, this.scene.scale.width - 24);
    const toY = Phaser.Math.Clamp(fromY + dir.y * distance, 24, this.scene.scale.height - 24);

    this.scene.tweens.add({
      targets: this,
      x: toX,
      y: toY,
      scaleX: this.scaleX * 1.05,
      scaleY: this.scaleY * 0.95,
      duration: this.cfg.attackWindupMs ?? this.getDefaultAttackWindup(),
      ease: 'Quad.easeOut',
      yoyo: true,
      onComplete: () => {
        if (this.active) {
          this.setScale(Math.abs(this.scaleX), Math.abs(this.scaleY));
        }
      },
    });

    if (!this.hasSprite) {
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(90, () => {
        if (!this.active) return;
        if (this.isFrozen) this.setTint(0x88ccff);
        else this.setTint(this.cfg.tint);
      });
    }
  }

  protected cancelAttack() {
    this.attackImpactEvent?.remove(false);
    this.attackEndEvent?.remove(false);
    this.attackImpactEvent = undefined;
    this.attackEndEvent = undefined;
    if (this.animState === 'attack') this.animState = 'idle';
  }

  private getDefaultAttackWindup() {
    if (this.cfg.damage >= 28) return 380;
    if (this.cfg.damage >= 20) return 320;
    if (this.cfg.damage >= 12) return 280;
    return 220;
  }

  private getDefaultAttackLunge() {
    if (this.cfg.damage >= 28) return 34;
    if (this.cfg.damage >= 20) return 28;
    if (this.cfg.damage >= 12) return 24;
    return 18;
  }
}
