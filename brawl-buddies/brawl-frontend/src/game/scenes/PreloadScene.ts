import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { tutorialMode, setTutorialMode } from '../tutorialMode';
import { CHARACTER_SPRITES, ENEMY_SPRITES, BOSS_SPRITES, type AnimKey } from '../sprites/spriteConfig';
import { sheetKey, registerAllAnimations } from '../utils/AnimationRegistry';
import { usePlayerStore } from '../../store/usePlayerStore';

const INK = 0x1a1a2e; // outline & mata: warna gelap yang bertahan saat sprite di-tint

/**
 * Memuat aset. Selama art asli belum ada, kita gambar tekstur placeholder yang
 * READABLE secara programatik: pemain = koki bertopi, musuh = koki galak tanpa
 * topi, bom = bulat bersumbu, boss = sosok besar bermahkota. Bentuk siluet yang
 * berbeda (bukan kotak warna biasa) membuat siapa-siapa langsung terbaca,
 * dan outline gelap tetap kontras walau sprite di-tint per karakter/musuh.
 *
 * Ganti dengan this.load.atlas(...) saat sprite/atlas pixel-art sudah tersedia.
 */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.buildLoadingBar();
    this.loadSpritesheets();
    this.loadBackgrounds();
    this.loadAudio();
    this.load.spritesheet('fire-anim', 'sprites/fire.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    registerAllAnimations(this);
    this.anims.create({
      key: 'fire-burn',
      frames: this.anims.generateFrameNumbers('fire-anim', { start: 0, end: 59 }),
      frameRate: 20,
      repeat: -1,
    });
    this.makeChef('tex-player', 64, 104, true); // pemain: bertopi koki
    this.makeChef('tex-enemy', 56, 92, false); // musuh biasa: tanpa topi, alis galak
    this.makeBig('tex-enemy-besar', 80, 104); // koki besar: bertubuh bongsor
    this.makeBomb('tex-enemy-bom', 56, 64); // koki bom: bulat + sumbu
    this.makeBoss('tex-boss', 120, 150); // boss: besar, bermahkota, taring
    this.makeStove('tex-stove', 72, 72);
    this.makeCircle('tex-ingredient', 16, 0xfff1c1);
    this.makeRect('tex-pixel', 4, 4, 0xffffff);
    // React MainMenu sudah menangani halaman utama; langsung ke pilih karakter di world tersimpan.
    const isTutorial = tutorialMode;
    setTutorialMode(false);

    if (isTutorial) {
      this.scene.start('TutorialScene');
      return;
    }

    const currentWorld = usePlayerStore.getState().currentWorld;
    this.scene.start('CharacterSelectScene', { world: currentWorld });
  }

  // ----- Tekstur karakter ----------------------------------------------------

  /** Sosok koki: badan jubah, kepala, mata, (opsional) topi koki. Base putih agar tint = warna asli. */
  private makeChef(key: string, w: number, h: number, hat: boolean) {
    const g = this.add.graphics();
    const cx = w / 2;
    const headR = w * 0.26;
    const headY = hat ? h * 0.34 : h * 0.28;

    // bayangan tanah (kontras pijakan 2.5D)
    g.fillStyle(0x000000, 0.18).fillEllipse(cx, h - 5, w * 0.7, 10);

    // badan / jubah
    g.fillStyle(0xffffff, 1).lineStyle(4, INK, 1);
    g.fillRoundedRect(cx - w * 0.3, headY, w * 0.6, h - headY - 10, 12);
    g.strokeRoundedRect(cx - w * 0.3, headY, w * 0.6, h - headY - 10, 12);

    // sabuk
    g.fillStyle(INK, 1).fillRect(cx - w * 0.3, h * 0.7, w * 0.6, 6);

    // kepala
    g.fillStyle(0xffffff, 1).fillCircle(cx, headY, headR);
    g.lineStyle(4, INK, 1).strokeCircle(cx, headY, headR);

    if (hat) {
      // topi koki (tiga gembung + pita)
      g.fillStyle(0xffffff, 1).lineStyle(4, INK, 1);
      g.fillCircle(cx - headR * 0.7, headY - headR * 1.1, headR * 0.55);
      g.fillCircle(cx + headR * 0.7, headY - headR * 1.1, headR * 0.55);
      g.fillCircle(cx, headY - headR * 1.45, headR * 0.7);
      g.fillRect(cx - headR, headY - headR * 1.05, headR * 2, headR * 0.8);
      g.strokeRect(cx - headR, headY - headR * 1.05, headR * 2, headR * 0.8);
    }

    // mata (gelap, bertahan walau di-tint)
    g.fillStyle(INK, 1);
    g.fillCircle(cx - headR * 0.4, headY, 3.2);
    g.fillCircle(cx + headR * 0.4, headY, 3.2);
    // senyum kecil
    g.lineStyle(2.5, INK, 1).beginPath();
    g.arc(cx, headY + headR * 0.25, headR * 0.4, 0.15 * Math.PI, 0.85 * Math.PI);
    g.strokePath();

    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Koki besar: tubuh lebar, lengan, alis galak. */
  private makeBig(key: string, w: number, h: number) {
    const g = this.add.graphics();
    const cx = w / 2;
    const headR = w * 0.2;
    const headY = h * 0.26;

    g.fillStyle(0x000000, 0.2).fillEllipse(cx, h - 6, w * 0.78, 12);

    // tubuh bongsor
    g.fillStyle(0xffffff, 1).lineStyle(5, INK, 1);
    g.fillRoundedRect(cx - w * 0.4, headY, w * 0.8, h - headY - 12, 16);
    g.strokeRoundedRect(cx - w * 0.4, headY, w * 0.8, h - headY - 12, 16);

    // kepala
    g.fillStyle(0xffffff, 1).fillCircle(cx, headY, headR);
    g.lineStyle(5, INK, 1).strokeCircle(cx, headY, headR);

    // alis galak
    g.fillStyle(INK, 1);
    g.fillTriangle(cx - headR * 0.7, headY - 4, cx - headR * 0.1, headY + 1, cx - headR * 0.7, headY + 3);
    g.fillTriangle(cx + headR * 0.7, headY - 4, cx + headR * 0.1, headY + 1, cx + headR * 0.7, headY + 3);
    // mata
    g.fillCircle(cx - headR * 0.35, headY + 3, 3);
    g.fillCircle(cx + headR * 0.35, headY + 3, 3);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Koki bom: badan bulat + sumbu menyala di atas. */
  private makeBomb(key: string, w: number, h: number) {
    const g = this.add.graphics();
    const cx = w / 2;
    const r = w * 0.4;
    const cy = h - r - 6;

    g.fillStyle(0x000000, 0.2).fillEllipse(cx, h - 4, w * 0.7, 9);

    // bola bom (base putih utk tint hijau)
    g.fillStyle(0xffffff, 1).fillCircle(cx, cy, r);
    g.lineStyle(4, INK, 1).strokeCircle(cx, cy, r);
    // kilau
    g.fillStyle(0xffffff, 0.9).fillCircle(cx - r * 0.35, cy - r * 0.35, r * 0.18);

    // mata panik
    g.fillStyle(INK, 1);
    g.fillCircle(cx - r * 0.35, cy, 3.5);
    g.fillCircle(cx + r * 0.35, cy, 3.5);

    // sumbu + percik api (warna tetap, bukan ikut tint utk telegraph bahaya)
    g.lineStyle(4, INK, 1).beginPath();
    g.moveTo(cx, cy - r);
    g.lineTo(cx + 6, cy - r - 12);
    g.strokePath();
    g.fillStyle(0xffa502, 1).fillCircle(cx + 6, cy - r - 14, 5);
    g.fillStyle(0xffd93d, 1).fillCircle(cx + 6, cy - r - 14, 2.5);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Boss: sosok besar, mahkota, taring, mata menyala. */
  private makeBoss(key: string, w: number, h: number) {
    const g = this.add.graphics();
    const cx = w / 2;
    const headR = w * 0.24;
    const headY = h * 0.32;

    g.fillStyle(0x000000, 0.22).fillEllipse(cx, h - 8, w * 0.82, 16);

    // tubuh
    g.fillStyle(0xffffff, 1).lineStyle(6, INK, 1);
    g.fillRoundedRect(cx - w * 0.34, headY, w * 0.68, h - headY - 14, 18);
    g.strokeRoundedRect(cx - w * 0.34, headY, w * 0.68, h - headY - 14, 18);

    // kepala
    g.fillStyle(0xffffff, 1).fillCircle(cx, headY, headR);
    g.lineStyle(6, INK, 1).strokeCircle(cx, headY, headR);

    // mahkota
    g.fillStyle(0xffd93d, 1).lineStyle(4, INK, 1);
    g.beginPath();
    g.moveTo(cx - headR, headY - headR * 0.7);
    g.lineTo(cx - headR, headY - headR * 1.7);
    g.lineTo(cx - headR * 0.5, headY - headR * 1.1);
    g.lineTo(cx, headY - headR * 1.9);
    g.lineTo(cx + headR * 0.5, headY - headR * 1.1);
    g.lineTo(cx + headR, headY - headR * 1.7);
    g.lineTo(cx + headR, headY - headR * 0.7);
    g.closePath();
    g.fillPath();
    g.strokePath();

    // mata menyala + alis galak
    g.fillStyle(INK, 1);
    g.fillTriangle(cx - headR * 0.7, headY - 6, cx - headR * 0.1, headY, cx - headR * 0.7, headY + 4);
    g.fillTriangle(cx + headR * 0.7, headY - 6, cx + headR * 0.1, headY, cx + headR * 0.7, headY + 4);
    g.fillStyle(0xff4757, 1);
    g.fillCircle(cx - headR * 0.4, headY + 4, 4);
    g.fillCircle(cx + headR * 0.4, headY + 4, 4);
    // taring
    g.fillStyle(0xffffff, 1).lineStyle(2, INK, 1);
    g.fillTriangle(cx - 6, headY + headR * 0.5, cx - 1, headY + headR * 0.5, cx - 4, headY + headR * 0.85);
    g.fillTriangle(cx + 6, headY + headR * 0.5, cx + 1, headY + headR * 0.5, cx + 4, headY + headR * 0.85);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Kompor: badan baja gelap bergaya cyberpunk. Api ditangani sprite terpisah. */
  private makeStove(key: string, w: number, h: number) {
    const g = this.add.graphics();
    const bodyY = h * 0.42;
    const bodyH = h * 0.52;

    // Shadow
    g.fillStyle(0x000000, 0.28).fillEllipse(w / 2, h - 3, w * 0.82, 10);

    // Badan utama – baja gelap
    g.fillStyle(0x1e222a, 1).lineStyle(3, 0x44505e, 1);
    g.fillRoundedRect(6, bodyY, w - 12, bodyH, 8);
    g.strokeRoundedRect(6, bodyY, w - 12, bodyH, 8);

    // Pelat kompor (atas)
    g.fillStyle(0x2a2e3a, 1).lineStyle(2, 0x555f6e, 1);
    g.fillRoundedRect(10, bodyY - 5, w - 20, 12, 4);
    g.strokeRoundedRect(10, bodyY - 5, w - 20, 12, 4);

    // Garis grill di pelat
    g.lineStyle(1.5, 0x111620, 0.85);
    for (let gx = 18; gx < w - 12; gx += 9) {
      g.beginPath().moveTo(gx, bodyY - 3).lineTo(gx, bodyY + 5).strokePath();
    }

    // Aksen neon cyan (cyberpunk)
    g.lineStyle(2, 0x00f5ff, 0.75);
    g.beginPath().moveTo(12, bodyY + bodyH - 9).lineTo(w - 12, bodyY + bodyH - 9).strokePath();

    // Tombol putar
    g.fillStyle(0x00f5ff, 0.85).lineStyle(1.5, INK, 1);
    g.fillCircle(w / 2, bodyY + bodyH * 0.55, 5);
    g.strokeCircle(w / 2, bodyY + bodyH * 0.55, 5);
    g.fillStyle(INK, 1).fillCircle(w / 2, bodyY + bodyH * 0.55, 2);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  // ----- Sprite loader -------------------------------------------------------

  /**
   * Muat semua spritesheet karakter & musuh dari public/sprites/.
   * File yang tidak ada (404) akan dilewati oleh Phaser — tidak crash.
   */
  private loadSpritesheets() {
    const allDefs = { ...CHARACTER_SPRITES, ...ENEMY_SPRITES, ...BOSS_SPRITES };
    for (const [id, def] of Object.entries(allDefs)) {
      for (const [animName, sheet] of Object.entries(def.sheets)) {
        this.load.spritesheet(
          sheetKey(id, animName as AnimKey),
          `${def.basePath}/${sheet.file}`,
          { frameWidth: def.frameWidth, frameHeight: def.frameHeight },
        );
      }
    }
  }

  // ----- Util & loading bar --------------------------------------------------

  private loadBackgrounds() {
    const layers: Array<[string, string]> = [
      ['bg-w1-back',  'backgrounds/world-1/back.png'],
      ['bg-w1-mid',   'backgrounds/world-1/mid.png'],
      ['bg-w1-front', 'backgrounds/world-1/front.png'],
      ['bg-w2-back',  'backgrounds/world-2/back.png'],
      ['bg-w2-mid',   'backgrounds/world-2/mid.png'],
      ['bg-w2-front', 'backgrounds/world-2/front.png'],
      ['bg-w3-back',  'backgrounds/world-3/back.png'],
      ['bg-w3-mid',   'backgrounds/world-3/mid.png'],
      ['bg-w3-front', 'backgrounds/world-3/front.png'],
      ['bg-w4-back',  'backgrounds/world-4/back.png'],
      ['bg-w4-mid',   'backgrounds/world-4/mid.png'],
      ['bg-w4-front', 'backgrounds/world-4/front.png'],
    ];
    for (const [key, path] of layers) {
      this.load.image(key, path);
    }
  }

  private loadAudio() {
    const sfxOgg = [
      'hit-light', 'hit-heavy', 'hit-special', 'enemy-die',
      'pickup', 'powerup', 'hurt', 'gameover', 'wave-start',
      'combo', 'boss-appear', 'cook',
    ];
    for (const k of sfxOgg) this.load.audio(k, `audio/sfx/${k}.ogg`);

    const sfxWav = ['explosion', 'world-clear', 'menu-click'];
    for (const k of sfxWav) this.load.audio(k, `audio/sfx/${k}.wav`);

    const bgms = ['world-1', 'world-2', 'world-3', 'world-4', 'boss', 'menu'];
    for (const k of bgms) this.load.audio(`bgm-${k}`, `audio/bgm/${k}.mp3`);
  }

  private buildLoadingBar() {
    const w = GAME_WIDTH * 0.4;
    const x = (GAME_WIDTH - w) / 2;
    const y = GAME_HEIGHT / 2;
    const bar = this.add.graphics();
    this.add
      .text(GAME_WIDTH / 2, y - 40, 'Memanaskan kompor...', {
        fontSize: '28px',
        color: '#1a1a2e',
      })
      .setOrigin(0.5);

    this.load.on('progress', (p: number) => {
      bar.clear().fillStyle(0xff4757, 1).fillRect(x, y, w * p, 24);
    });
  }

  private makeRect(key: string, w: number, h: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color, 1).fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makeCircle(key: string, r: number, color: number) {
    const g = this.add.graphics();
    g.fillStyle(color, 1).fillCircle(r, r, r);
    g.lineStyle(3, INK, 1).strokeCircle(r, r, r);
    g.generateTexture(key, r * 2, r * 2);
    g.destroy();
  }
}
