import Phaser from 'phaser';

/**
 * Helper animasi. Saat sprite sheet asli sudah ada, daftarkan animasi
 * di sini. Untuk sekarang menyediakan efek squash & stretch (prinsip PRD)
 * dan teks komik pop-up ("BIFF!", "WHAM!").
 */
export const AnimationHelper = {
  /** Squash & stretch dipakai di semua hit reaction. */
  squash(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite) {
    scene.tweens.add({
      targets: target,
      scaleX: target.scaleX * 1.2,
      scaleY: target.scaleY * 0.8,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  },

  /** Teks komik melayang saat hit. */
  comicPop(scene: Phaser.Scene, x: number, y: number, words = ['BIFF!', 'WHAM!', 'SPLAT!', 'BONK!']) {
    const word = Phaser.Utils.Array.GetRandom(words);
    const t = scene.add
      .text(x, y, word, {
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#ffd93d',
        stroke: '#1a1a2e',
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    scene.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      scale: 1.4,
      duration: 600,
      onComplete: () => t.destroy(),
    });
  },
};
