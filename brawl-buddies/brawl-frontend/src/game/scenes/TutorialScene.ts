import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { createPlayer } from '../entities/createPlayer';
import type Player from '../entities/Player';
import BaseEnemy, { type EnemyConfig } from '../entities/enemies/BaseEnemy';
import CombatSystem from '../systems/CombatSystem';
import CookingSystem from '../systems/CookingSystem';
import PowerUpSystem from '../systems/PowerUpSystem';
import { setTutorialMode } from '../tutorialMode';
import { EventBus } from '../EventBus';

const STILL: EnemyConfig = {
  hp: 36, speed: 0, damage: 0, staggerThreshold: 999, tint: 0x888888, drop: '🍅',
};
const TANK: EnemyConfig = {
  hp: 9999, speed: 60, damage: 0, staggerThreshold: 999, tint: 0x888888, drop: '🍅',
};

/**
 * Tutorial 5 langkah.
 * Semua UI digambar di dalam scene Phaser — tidak butuh HUD React overlay.
 */
export default class TutorialScene extends Phaser.Scene {
  // ── Entitas ──────────────────────────────────────────────────────────────────
  private player!: Player;
  private enemies: BaseEnemy[] = [];
  private ingredientSprites: Phaser.Physics.Arcade.Image[] = [];
  private combat = new CombatSystem();
  private cooking!: CookingSystem;

  // ── State ────────────────────────────────────────────────────────────────────
  private step = 0;
  private transitioning = false;
  private stepObjects: Phaser.GameObjects.GameObject[] = [];

  // step 1
  private lightUsed = false;
  private heavyUsed = false;

  // step 2
  private cookPhase = 0; // 0=kill, 1=pickup, 2=goto stove, 3=cook
  private stove?: Phaser.GameObjects.Image;

  // step 3
  private specialFired = false;
  private energyFill?: Phaser.GameObjects.Graphics;

  // ── UI permanente (bottom panel) ─────────────────────────────────────────────
  private instructTxt!: Phaser.GameObjects.Text;
  private subTxt!: Phaser.GameObjects.Text;
  private stepDots!: Phaser.GameObjects.Text;

  // ── Keys (E dan F dikelola scene, bukan Player) ───────────────────────────────
  private eKey!: Phaser.Input.Keyboard.Key;
  private fKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('TutorialScene');
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  create() {
    this.transitioning = false;
    this.step = 0;
    this.stepObjects = [];
    this.enemies = [];
    this.ingredientSprites = [];

    this.cameras.main.setBackgroundColor('#9bd1ff');
    this.drawFloor();

    this.cooking = new CookingSystem();
    this.player = createPlayer(this, GAME_WIDTH / 2, GAME_HEIGHT * 0.5, 'lala');

    const kb = this.input.keyboard!;
    this.eKey = kb.addKey('E', false);
    this.fKey = kb.addKey('F', false);

    this.buildPanel();
    this.showStep(0);
  }

  update(_time: number, delta: number) {
    if (this.transitioning) return;

    this.player.tick(delta, (t) => this.onAttack(t));

    const pv = new Phaser.Math.Vector2(this.player.x, this.player.y);
    this.enemies = this.enemies.filter((e) => {
      if (!e.active) return false;
      e.tick(delta, pv);
      return true;
    });

    switch (this.step) {
      case 0: this.tickMovement(); break;
      case 1: this.tickAttack(); break;
      case 2: this.tickCooking(); break;
      case 3: this.tickSpecial(); break;
    }

    // refresh energy bar di step 3
    if (this.step === 3 && this.energyFill) {
      const filled = 300 * Phaser.Math.Clamp(this.player.energy / 100, 0, 1);
      this.energyFill.clear().fillStyle(0xffd93d, 1).fillRect(
        GAME_WIDTH / 2 - 150,
        GAME_HEIGHT - 132,
        filled,
        16,
      );
    }
  }

  // ── Attack callback ──────────────────────────────────────────────────────────

  private onAttack(type: 'light' | 'heavy' | 'special') {
    const res = this.combat.resolveAttack(this.player, type, this.enemies, new PowerUpSystem());

    if (res.hitCount > 0) this.player.addEnergy(6 * res.hitCount);

    if (this.step === 1) {
      if (type === 'light') this.lightUsed = true;
      if (type === 'heavy') this.heavyUsed = true;
    }
    if (this.step === 3 && type === 'special') this.specialFired = true;

    for (const killed of res.killed) {
      this.spawnIngredient(killed.x, killed.y + 24);
      killed.destroy();
    }
    this.enemies = this.enemies.filter((e) => e.active);
  }

  // ── Per-step tick ────────────────────────────────────────────────────────────

  private tickMovement() {
    // Target zone center simpan di data scene
    const tx = this.data.get('tx') as number;
    const ty = this.data.get('ty') as number;
    const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, tx, ty);
    if (d < 68) this.advance('✅ Gerakan dikuasai!');
  }

  private tickAttack() {
    const alive = this.enemies.length > 0;

    if (!alive && this.lightUsed && this.heavyUsed) {
      this.advance('✅ Serangan dikuasai!');
      return;
    }

    if (!this.lightUsed && !this.heavyUsed) {
      this.subTxt.setText('Tekan J (ringan) dan K (berat) untuk menyerang!');
    } else if (!this.lightUsed) {
      this.subTxt.setText('Bagus! Sekarang tekan J untuk serangan ringan!');
    } else if (!this.heavyUsed) {
      this.subTxt.setText('Bagus! Sekarang tekan K untuk serangan berat!');
    } else {
      this.subTxt.setText('Mantap! Kalahkan musuhnya!');
    }
  }

  private tickCooking() {
    const near = this.stove
      ? Phaser.Math.Distance.Between(this.player.x, this.player.y, this.stove.x, this.stove.y) < 130
      : false;

    // Kompor glow
    if (this.stove) this.stove.setAlpha(near ? 1 : 0.7);

    switch (this.cookPhase) {
      case 0:
        if (this.enemies.length === 0) {
          this.cookPhase = 1;
          this.subTxt.setText('Tekan F dekat bahan 🍅 untuk mengambilnya!');
        }
        break;

      case 1:
        if (Phaser.Input.Keyboard.JustDown(this.fKey)) {
          if (this.tryPickup()) {
            this.cooking.addIngredient('🍅');
            this.cookPhase = 2;
            this.subTxt.setText('Sekarang berjalan ke kompor di pojok kiri atas! 🍳');
          }
        }
        break;

      case 2:
        if (near) {
          this.cookPhase = 3;
          this.subTxt.setText('Tekan E untuk memasak! ✨');
        }
        break;

      case 3:
        if (!near) {
          this.cookPhase = 2;
          this.subTxt.setText('Kembali ke kompor dulu! 🍳');
          break;
        }
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
          const result = this.cooking.cook();
          if (typeof result === 'object' && result !== null) {
            this.showToast(`🍽️ ${result.dish}!`, 0x2ed573);
            this.advance('✅ Masakan berhasil!');
          } else if (typeof result === 'string') {
            this.showToast(result, 0xff4757);
          }
        }
        break;
    }
  }

  private tickSpecial() {
    if (this.specialFired) {
      this.advance('✅ Serangan Spesial dilepaskan! 💥');
    } else if (this.player.energy >= 100) {
      this.subTxt.setText('Energi PENUH! Tekan L untuk serangan KHUSUS! 💥');
    } else {
      const pct = Math.floor(this.player.energy);
      this.subTxt.setText(`Serang musuh untuk mengisi energi... ${pct}%`);
    }
  }

  // ── Ingredient mechanics ─────────────────────────────────────────────────────

  private spawnIngredient(x: number, y: number) {
    const img = this.physics.add.image(x, y, 'tex-ingredient').setTint(0xff4757);
    img.setData('isIngredient', true);
    this.ingredientSprites.push(img);
    this.stepObjects.push(img);
  }

  private tryPickup(): boolean {
    for (let i = this.ingredientSprites.length - 1; i >= 0; i--) {
      const img = this.ingredientSprites[i];
      if (!img.active) { this.ingredientSprites.splice(i, 1); continue; }
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, img.x, img.y);
      if (d < 80) {
        img.destroy();
        this.ingredientSprites.splice(i, 1);
        this.showToast('🍅 diambil!', 0xffd93d);
        return true;
      }
    }
    return false;
  }

  // ── Step transitions ─────────────────────────────────────────────────────────

  private advance(msg: string) {
    if (this.transitioning) return;
    this.transitioning = true;
    this.showToast(msg, 0xffd93d);
    this.time.delayedCall(1400, () => {
      this.transitioning = false;
      this.showStep(this.step + 1);
    });
  }

  private showStep(n: number) {
    this.step = n;

    // Bersihkan objek step sebelumnya
    for (const obj of this.stepObjects) if ((obj as { active?: boolean }).active !== false) obj.destroy();
    this.stepObjects = [];
    for (const e of this.enemies) e.active && e.destroy();
    this.enemies = [];
    this.ingredientSprites = [];
    this.stove = undefined;
    this.energyFill = undefined;

    this.updateDots();

    switch (n) {
      case 0: this.setupMovement(); break;
      case 1: this.setupAttack(); break;
      case 2: this.setupCooking(); break;
      case 3: this.setupSpecial(); break;
      case 4: this.setupComplete(); break;
    }
  }

  // ── Step setups ──────────────────────────────────────────────────────────────

  private setupMovement() {
    this.instructTxt.setText('LANGKAH 1 / 4 — Gerakan');
    this.subTxt.setText('Gunakan WASD untuk bergerak ke lingkaran kuning!');

    const tx = GAME_WIDTH * 0.75;
    const ty = GAME_HEIGHT * 0.4;
    this.data.set('tx', tx);
    this.data.set('ty', ty);

    const zone = this.add.graphics();
    zone.fillStyle(0xffd93d, 0.3).lineStyle(3, 0xffd93d, 1);
    zone.fillCircle(tx, ty, 64).strokeCircle(tx, ty, 64);
    this.stepObjects.push(zone);

    this.tweens.add({ targets: zone, alpha: { from: 1, to: 0.35 }, yoyo: true, repeat: -1, duration: 600 });

    const lbl = this.add.text(tx, ty, '🎯', { fontSize: '32px' }).setOrigin(0.5);
    this.stepObjects.push(lbl);
  }

  private setupAttack() {
    this.lightUsed = false;
    this.heavyUsed = false;

    this.instructTxt.setText('LANGKAH 2 / 4 — Serangan Dasar');
    this.subTxt.setText('Tekan J (ringan) dan K (berat) untuk menyerang!');

    const enemy = new BaseEnemy(this, GAME_WIDTH * 0.65, GAME_HEIGHT * 0.4, STILL);
    this.enemies.push(enemy);
    this.stepObjects.push(enemy);

    const lbl = this.add.text(GAME_WIDTH * 0.65, GAME_HEIGHT * 0.4 - 65, 'DUMMY', {
      fontSize: '14px', color: '#aaaaaa',
    }).setOrigin(0.5);
    this.stepObjects.push(lbl);

    const hint = this.add.text(GAME_WIDTH / 2, 40,
      'J = Serangan Ringan  |  K = Serangan Berat', {
        fontSize: '17px', color: '#ffffffcc',
        backgroundColor: '#00000088', padding: { x: 12, y: 6 },
      }).setOrigin(0.5);
    this.stepObjects.push(hint);
  }

  private setupCooking() {
    this.cookPhase = 0;
    this.cooking = new CookingSystem();
    this.cooking.addIngredient('🧅'); // bahan awal sudah ada

    this.instructTxt.setText('LANGKAH 3 / 4 — Sistem Memasak');
    this.subTxt.setText('Kalahkan musuh untuk dapatkan bahan 🍅!');

    // Kompor — pojok kanan bawah (konsisten dengan GameScene & BossScene)
    const sx = GAME_WIDTH - 130;
    const sy = GAME_HEIGHT - 130;
    this.stove = this.add.image(sx, sy, 'tex-stove');
    this.stepObjects.push(this.stove);

    if (this.textures.exists('fire-anim')) {
      const stoveFire = this.add.sprite(sx, sy - 68, 'fire-anim').setScale(0.7);
      stoveFire.play('fire-burn');
      this.stepObjects.push(stoveFire);
    }

    const glowRing = this.add.graphics().lineStyle(4, 0xffd93d, 1).strokeCircle(sx, sy, 52);
    this.tweens.add({ targets: glowRing, alpha: { from: 1, to: 0.2 }, yoyo: true, repeat: -1, duration: 800 });
    this.stepObjects.push(glowRing);

    const stoveLbl = this.add.text(sx, sy + 48, '🍳 KOMPOR\n(Bahan: 🧅 sudah ada)', {
      fontSize: '13px', color: '#ffd93d', align: 'center',
    }).setOrigin(0.5, 0);
    this.stepObjects.push(stoveLbl);

    const hint = this.add.text(GAME_WIDTH / 2, 40,
      'F = Ambil bahan  |  E dekat kompor = Masak', {
        fontSize: '17px', color: '#ffffffcc',
        backgroundColor: '#00000088', padding: { x: 12, y: 6 },
      }).setOrigin(0.5);
    this.stepObjects.push(hint);

    const enemy = new BaseEnemy(this, GAME_WIDTH * 0.6, GAME_HEIGHT * 0.42, { ...STILL, drop: '🍅' });
    this.enemies.push(enemy);
    this.stepObjects.push(enemy);
  }

  private setupSpecial() {
    this.specialFired = false;
    this.player.energy = 0;

    this.instructTxt.setText('LANGKAH 4 / 4 — Serangan Spesial');
    this.subTxt.setText('Serang musuh untuk mengisi energi! Saat penuh, tekan L! 💥');

    const hint = this.add.text(GAME_WIDTH / 2, 40,
      'J / K = Isi energi  |  L (saat energi penuh) = Serangan Spesial', {
        fontSize: '17px', color: '#ffffffcc',
        backgroundColor: '#00000088', padding: { x: 12, y: 6 },
      }).setOrigin(0.5);
    this.stepObjects.push(hint);

    // Label energi
    const eLbl = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 155, 'ENERGI', {
      fontSize: '13px', fontStyle: 'bold', color: '#ffd93d',
    }).setOrigin(0.5);
    this.stepObjects.push(eLbl);

    // Bar background
    const barBg = this.add.graphics()
      .fillStyle(0x222222, 0.85)
      .fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT - 140, 300, 16);
    this.stepObjects.push(barBg);

    // Bar fill (diupdate tiap frame di update())
    this.energyFill = this.add.graphics();
    this.stepObjects.push(this.energyFill);

    // 3 dummy tank
    const pts = [
      { x: GAME_WIDTH * 0.2, y: GAME_HEIGHT * 0.28 },
      { x: GAME_WIDTH * 0.75, y: GAME_HEIGHT * 0.28 },
      { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.2 },
    ];
    for (const p of pts) {
      const e = new BaseEnemy(this, p.x, p.y, TANK);
      this.enemies.push(e);
      this.stepObjects.push(e);
    }
  }

  private setupComplete() {
    this.transitioning = true; // blok update() agar tidak tick player yang sudah di-destroy

    // Sembunyikan panel bawah
    this.instructTxt.setVisible(false);
    this.subTxt.setVisible(false);
    this.stepDots.setVisible(false);
    this.player.destroy();

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.78).fillRoundedRect(cx - 310, cy - 170, 620, 340, 20);
    bg.lineStyle(3, 0x2ed573, 1).strokeRoundedRect(cx - 310, cy - 170, 620, 340, 20);

    this.add.text(cx, cy - 100, '🎉 Tutorial Selesai!', {
      fontSize: '46px', fontStyle: 'bold', color: '#2ed573',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 30, 'Kamu siap bertarung di Chaos Kitchen!', {
      fontSize: '22px', color: '#ffffff',
    }).setOrigin(0.5);

    this.makeBtn(cx, cy + 50, '⚔️  MULAI PETUALANGAN', 0xff4757, 0xff6b81, () => {
      setTutorialMode(false);
      EventBus.emit('tutorial:goto-play'); // React navigates to /play → GamePage mounts dengan HUD penuh
    });

    this.makeBtn(cx, cy + 112, '🔁  ULANG TUTORIAL', 0x2f3542, 0x485460, () => {
      this.scene.restart();
    });
  }

  // ── UI helpers ───────────────────────────────────────────────────────────────

  private buildPanel() {
    const py = GAME_HEIGHT - 104;

    this.add.graphics()
      .fillStyle(0x000000, 0.68)
      .fillRect(0, py, GAME_WIDTH, 104);

    this.instructTxt = this.add.text(GAME_WIDTH / 2, py + 20, '', {
      fontSize: '21px', fontStyle: 'bold', color: '#ffffff',
    }).setOrigin(0.5);

    this.subTxt = this.add.text(GAME_WIDTH / 2, py + 54, '', {
      fontSize: '18px', color: '#ffd93d',
    }).setOrigin(0.5);

    this.stepDots = this.add.text(GAME_WIDTH / 2, py + 84, '', {
      fontSize: '13px', color: '#888888',
    }).setOrigin(0.5);
  }

  private updateDots() {
    if (!this.stepDots) return;
    const total = 4;
    const dots = Array.from({ length: total }, (_, i) =>
      (i === Math.min(this.step, total - 1) ? '●' : '○'),
    ).join('   ');
    this.stepDots.setText(dots);
  }

  private showToast(msg: string, color: number) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const t = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90, msg, {
      fontSize: '28px', fontStyle: 'bold', color: hex,
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: t, y: t.y - 55, alpha: 0, duration: 1100, onComplete: () => t.destroy() });
  }

  private makeBtn(x: number, y: number, label: string, color: number, hov: number, cb: () => void) {
    const W = 330;
    const H = 46;
    const bg = this.add.graphics().setDepth(10);
    const draw = (c: number) => bg.clear().fillStyle(c, 1).fillRoundedRect(x - W / 2, y - H / 2, W, H, 10);
    draw(color);
    this.add.text(x, y, label, { fontSize: '20px', fontStyle: 'bold', color: '#fff' })
      .setOrigin(0.5).setDepth(11);
    this.add.zone(x, y, W, H).setInteractive({ useHandCursor: true })
      .on('pointerover', () => draw(hov))
      .on('pointerout', () => draw(color))
      .on('pointerdown', cb)
      .setDepth(12);
  }

  private drawFloor() {
    const g = this.add.graphics().setDepth(-1);
    g.fillStyle(0x7ec8e3, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.lineStyle(1, 0x5aa8c3, 0.35);
    for (let x = 0; x < GAME_WIDTH; x += 64) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 64) g.lineBetween(0, y, GAME_WIDTH, y);
  }
}
