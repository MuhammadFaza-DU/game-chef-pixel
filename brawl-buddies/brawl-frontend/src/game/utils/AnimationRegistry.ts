import Phaser from 'phaser';
import { CHARACTER_SPRITES, ENEMY_SPRITES, BOSS_SPRITES, type AnimKey } from '../sprites/spriteConfig';

/** Texture key unik untuk satu animasi satu entitas. */
export function sheetKey(entityId: string, anim: AnimKey): string {
  return `${entityId}__${anim}`;
}

/**
 * Daftarkan semua animasi ke Phaser.AnimationManager.
 * Dipanggil sekali di PreloadScene.create() setelah semua file selesai dimuat.
 * File yang tidak ada (404) akan dilewati — game fallback ke placeholder.
 */
export function registerAllAnimations(scene: Phaser.Scene): void {
  const allDefs = { ...CHARACTER_SPRITES, ...ENEMY_SPRITES, ...BOSS_SPRITES };

  for (const [id, def] of Object.entries(allDefs)) {
    for (const [animName, sheet] of Object.entries(def.sheets)) {
      const anim = animName as AnimKey;
      const key = sheetKey(id, anim);

      if (!scene.textures.exists(key)) continue;
      if (scene.anims.exists(key)) continue;

      const loop = anim === 'idle' || anim === 'run';
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(key, { start: 0, end: sheet.frames - 1 }),
        frameRate: sheet.frameRate,
        repeat: loop ? -1 : 0,
      });
    }
  }
}
