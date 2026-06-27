import Phaser from 'phaser';
import { CHARACTERS, type CharacterId, type CharacterDef } from './characters';
import { sheetKey } from '../utils/AnimationRegistry';
import type { AnimKey } from '../sprites/spriteConfig';
import AudioManager from '../systems/AudioManager';

type AttackInput = 'light' | 'heavy' | 'special';
type AnimState = 'idle' | 'run' | 'attack' | 'hurt' | 'dead';

type Keys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  light: Phaser.Input.Keyboard.Key;
  heavy: Phaser.Input.Keyboard.Key;
  special: Phaser.Input.Keyboard.Key;
};

/**
 * Entity pemain. Gerak 8-arah (beat 'em up), light/heavy/special attack.
 * Mendukung dua mode visual:
 *   - hasSprite=true  → animasi LuizMelo spritesheet (PNG per anim)
 *   - hasSprite=false → siluet koki programatik + tint warna karakter (fallback)
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  readonly def: CharacterDef;
  maxHp: number;
  hp: number;
  energy = 0;
  facing: 1 | -1 = 1;
  readonly hasSprite: boolean;

  private keys: Keys;
  private attackCooldown = 0;
  private animState: AnimState = 'idle';
  private attackPhase: 1 | 2 = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, characterId: CharacterId) {
    // Cek sprite sebelum super — boleh karena tidak pakai `this`
    const idleKey = sheetKey(characterId, 'idle');
    const hasSprite = scene.textures.exists(idleKey);
    super(scene, x, y, hasSprite ? idleKey : 'tex-player');

    this.def = CHARACTERS[characterId];
    this.maxHp = 80 + this.def.stats.defense * 20;
    this.hp = this.maxHp;
    this.hasSprite = hasSprite;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    if (hasSprite) {
      this.playAnim('idle');
    } else {
      this.setTint(this.def.color);
    }

    const kb = scene.input.keyboard!;
    this.keys = kb.addKeys(
      { up: 'W', down: 'S', left: 'A', right: 'D', light: 'J', heavy: 'K', special: 'L' },
      false,
    ) as Keys;
  }

  /** Dipanggil tiap frame dari GameScene.update. */
  tick(delta: number, onAttack: (type: AttackInput) => void, onSpecialFail?: () => void) {
    if (this.animState === 'dead') return;
    if (!this.body) return;
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);

    const v = this.def.moveSpeed;
    let vx = 0;
    let vy = 0;
    if (this.keys.left.isDown) vx -= v;
    if (this.keys.right.isDown) vx += v;
    if (this.keys.up.isDown) vy -= v;
    if (this.keys.down.isDown) vy += v;
    this.setVelocity(vx, vy);

    if (vx !== 0) {
      this.facing = vx > 0 ? 1 : -1;
      this.setFlipX(this.facing < 0);
    }

    // Transisi idle/run hanya bila tidak dalam state blocking (attack/hurt)
    if (this.animState !== 'attack' && this.animState !== 'hurt') {
      const next: AnimState = vx !== 0 || vy !== 0 ? 'run' : 'idle';
      if (this.animState !== next) {
        this.animState = next;
        this.playAnim(next as 'idle' | 'run');
      }
    }

    if (this.attackCooldown > 0) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.light)) {
      this.attackCooldown = 220;
      this.triggerAttack('light', onAttack);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.heavy)) {
      this.attackCooldown = 520;
      this.triggerAttack('heavy', onAttack);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.special)) {
      if (this.energy >= 100) {
        this.energy = 0;
        this.attackCooldown = 700;
        this.triggerAttack('special', onAttack);
      } else {
        onSpecialFail?.();
      }
    }
  }

  takeDamage(amount: number) {
    if (this.animState === 'dead') return;
    const reduced = amount * (1 - this.def.stats.defense * 0.06);
    this.hp = Math.max(0, this.hp - reduced);
    AudioManager.sfx('hurt');
    this.scene.cameras.main.shake(120, 0.006);

    if (!this.hasSprite) {
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(80, () => this.setTint(this.def.color));
    }

    if (this.hp <= 0) {
      this.animState = 'dead';
      this.playOnce('dead');
    } else {
      this.animState = 'hurt';
      this.playOnce('hurt', () => {
        if (this.animState === 'hurt') this.animState = 'idle';
      });
    }
  }

  addEnergy(amount: number) {
    this.energy = Phaser.Math.Clamp(this.energy + amount, 0, 100);
  }

  get isDead() {
    return this.hp <= 0;
  }

  // ─── Animasi internal ──────────────────────────────────────────────────────

  /** Mainkan animasi looping (idle/run). Tidak interrupt jika sudah aktif. */
  private playAnim(state: 'idle' | 'run') {
    if (!this.hasSprite) return;
    const key = sheetKey(this.def.id, state);
    if (!this.scene.anims.exists(key)) return;
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }

  /** Mainkan animasi sekali; panggil onDone saat selesai. */
  private playOnce(anim: AnimKey, onDone?: () => void) {
    if (!this.hasSprite) {
      onDone?.();
      return;
    }
    const key = sheetKey(this.def.id, anim);
    if (!this.scene.anims.exists(key)) {
      onDone?.();
      return;
    }
    this.play(key);
    if (onDone) this.once(`animationcomplete-${key}`, onDone);
  }

  /**
   * Trigger serangan: putar animasi attack1/attack2 bergantian,
   * lalu panggil callback game (damage, hitbox, dll).
   */
  private triggerAttack(type: AttackInput, cb: (type: AttackInput) => void) {
    const sfxMap = { light: 'hit-light', heavy: 'hit-heavy', special: 'hit-special' } as const;
    AudioManager.sfx(sfxMap[type], type === 'special' ? 0.9 : 0.75);
    const animKey: AnimKey = this.attackPhase === 1 ? 'attack1' : 'attack2';
    this.attackPhase = this.attackPhase === 1 ? 2 : 1;
    this.animState = 'attack';
    this.playOnce(animKey, () => {
      if (this.animState === 'attack') this.animState = 'idle';
    });
    cb(type);
  }
}
