import Phaser from 'phaser';

/**
 * Overlay daftar resep masakan untuk fitur "tahan E 1.2 detik = lihat resep".
 * Menampilkan 4 resep + Nasi Goreng Kosmik sebagai panel di tengah layar.
 */

const RECIPE_LINES = [
  { combo: '🍗 + 🌶️', dish: 'AYAM GEPREK', note: 'damage +50%' },
  { combo: '🍅 + 🧅', dish: 'SAMBAL', note: 'pukulan splash AoE' },
  { combo: '🍳 + 🧀', dish: 'OMELET', note: 'HP +40' },
  { combo: '🍌 + 🍦', dish: 'ES PISANG', note: 'bekukan musuh' },
  { combo: '4 bahan beda', dish: 'NASI GORENG KOSMIK', note: 'mode ULTRA 10 dtk' },
];

const HOLD_HINT = 'Tahan E 1.2 detik untuk resep ini.';

/** Buat overlay resep di tengah layar dan tampilkan. Kembalikan container-nya. */
export function showRecipeOverlay(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const overlay = scene.add.container(0, 0).setDepth(50).setVisible(false);
  const cx = scene.scale.width / 2;
  const cy = scene.scale.height / 2;

  const panel = scene.add.graphics();
  panel.fillStyle(0x180d1a, 0.9);
  panel.fillRoundedRect(cx - 280, cy - 210, 560, 420, 22);
  panel.lineStyle(5, 0xffcf5a, 1);
  panel.strokeRoundedRect(cx - 280, cy - 210, 560, 420, 22);
  overlay.add(panel);

  const title = scene.add
    .text(cx, cy - 175, '📜 MENU RAHASIA', { fontSize: '28px', fontStyle: 'bold', color: '#ffcf5a', stroke: '#2c1621', strokeThickness: 4 })
    .setOrigin(0.5);
  overlay.add(title);

  RECIPE_LINES.forEach((r, i) => {
    const y = cy - 120 + i * 52;
    const combo = scene.add
      .text(cx - 230, y, r.combo, { fontSize: '20px', color: '#fff7d8' })
      .setOrigin(0, 0.5);
    const dish = scene.add
      .text(cx + 40, y, r.dish, { fontSize: '21px', fontStyle: 'bold', color: '#ffffff' })
      .setOrigin(0, 0.5);
    const note = scene.add
      .text(cx + 40, y + 20, r.note, { fontSize: '13px', color: '#8c8ca3' })
      .setOrigin(0, 0.5);
    overlay.add(combo);
    overlay.add(dish);
    overlay.add(note);
  });

  const hint = scene.add
    .text(cx, cy + 150, HOLD_HINT, { fontSize: '14px', color: '#ffcf5a' })
    .setOrigin(0.5);
  overlay.add(hint);

  overlay.setVisible(true);
  return overlay;
}

/** Sembunyikan & hancurkan overlay resep. */
export function hideRecipeOverlay(overlay?: Phaser.GameObjects.Container) {
  overlay?.setVisible(false);
  overlay?.destroy();
}