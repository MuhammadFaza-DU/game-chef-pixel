import Phaser from 'phaser';
import type Player from '../entities/Player';
import type BaseEnemy from '../entities/enemies/BaseEnemy';
import type PowerUpSystem from './PowerUpSystem';

export type AttackType = 'light' | 'heavy' | 'special';

interface AttackResult {
  hitCount: number;
  killed: BaseEnemy[];
}

/**
 * Menghitung hit serangan pemain terhadap musuh.
 * Hitbox sederhana: lingkaran di depan pemain (light/heavy) atau
 * area melingkar (special). Damage diskalakan power-up.
 *
 * Efek power-up yang ditangani di sini:
 *   aoe    → splash 50% damage ke musuh dalam radius 80px dari target yang kena
 *   freeze → bekukan setiap musuh yang kena selama 2 detik
 */
export default class CombatSystem {
  resolveAttack(
    player: Player,
    type: AttackType,
    enemies: BaseEnemy[],
    powerups: PowerUpSystem,
  ): AttackResult {
    const base = player.def.lightDamage;
    const { reach, radius, mult } = this.profile(type, player);
    const dmg = base * mult * powerups.damageMultiplier;
    const hasAoe = powerups.has('aoe');
    const hasFreeze = powerups.has('freeze');

    const cx = type === 'special' ? player.x : player.x + player.facing * reach;
    const cy = player.y;

    const killed: BaseEnemy[] = [];
    let hitCount = 0;

    for (const e of enemies) {
      if (!e.active) continue;
      const d = Phaser.Math.Distance.Between(cx, cy, e.x, e.y);
      if (d > radius) continue;

      hitCount += 1;

      if (hasFreeze) e.applyFreeze(2000);

      const dead = e.takeDamage(dmg);
      const ang = Phaser.Math.Angle.Between(player.x, player.y, e.x, e.y);
      const kb = type === 'heavy' ? 320 : type === 'special' ? 420 : 140;
      e.setVelocity(Math.cos(ang) * kb, Math.sin(ang) * kb);
      if (dead && !killed.includes(e)) killed.push(e);

      // AOE: splash 50% ke musuh lain dalam radius 80px dari target
      if (hasAoe) {
        this.spawnAoeFx(player.scene, e.x, e.y);
        for (const other of enemies) {
          if (other === e || !other.active) continue;
          const dist = Phaser.Math.Distance.Between(e.x, e.y, other.x, other.y);
          if (dist > 80) continue;
          const splashDead = other.takeDamage(dmg * 0.5);
          if (splashDead && !killed.includes(other)) killed.push(other);
        }
      }
    }

    this.spawnHitFx(player.scene, cx, cy, radius, type);
    return { hitCount, killed };
  }

  private profile(type: AttackType, player: Player) {
    switch (type) {
      case 'heavy':
        return { reach: 70, radius: 80, mult: 2.2 };
      case 'special': {
        const r = (player as Player & { specialRadius?: () => number }).specialRadius?.() ?? 170;
        return { reach: 0, radius: r, mult: 3 };
      }
      default:
        return { reach: 55, radius: 60, mult: 1 };
    }
  }

  /** Ring merah menyebar dari titik AOE. */
  private spawnAoeFx(scene: Phaser.Scene, x: number, y: number) {
    const ring = scene.add.circle(x, y, 8, 0xff4757, 0.8).setDepth(6);
    scene.tweens.add({
      targets: ring,
      scaleX: 10,
      scaleY: 10,
      alpha: 0,
      duration: 280,
      ease: 'Cubic.Out',
      onComplete: () => ring.destroy(),
    });
  }

  private spawnHitFx(scene: Phaser.Scene, x: number, y: number, r: number, type: AttackType) {
    const color = type === 'special' ? 0xffd93d : 0xffffff;
    const ring = scene.add.circle(x, y, r * 0.4, color, 0.5);
    scene.tweens.add({
      targets: ring,
      scale: 2,
      alpha: 0,
      duration: type === 'special' ? 400 : 180,
      onComplete: () => ring.destroy(),
    });
  }
}
