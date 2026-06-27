import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { EventBus } from '../EventBus';
import { createPlayer } from '../entities/createPlayer';
import type Player from '../entities/Player';
import type { CharacterId } from '../entities/characters';
import BaseEnemy from '../entities/enemies/BaseEnemy';
import KokiBiasa from '../entities/enemies/KokiBiasa';
import KokiBesar from '../entities/enemies/KokiBesar';
import KokiBom from '../entities/enemies/KokiBom';
import CombatSystem from '../systems/CombatSystem';
import ComboSystem from '../systems/ComboSystem';
import CookingSystem, { type Ingredient } from '../systems/CookingSystem';
import PowerUpSystem from '../systems/PowerUpSystem';
import { WORLDS } from '../levels';
import type { EnemyKind } from '../levels/types';
import { AnimationHelper } from '../utils/AnimationHelper';
import { registerPause } from '../utils/pauseControls';
import { ParallaxBackground } from '../utils/ParallaxBackground';
import AudioManager from '../systems/AudioManager';

interface GameSceneData {
  characterId: CharacterId;
  world: number;
}

/** Scene gameplay utama: spawn wave, combat, cooking, lanjut ke boss. */
export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies: BaseEnemy[] = [];
  private ingredients!: Phaser.Physics.Arcade.Group;
  private stove!: Phaser.GameObjects.Image;
  private stoveFire?: Phaser.GameObjects.Sprite;
  private stoveGlow!: Phaser.GameObjects.Graphics;
  private stovePrompt!: Phaser.GameObjects.Text;

  private combat = new CombatSystem();
  private combo = new ComboSystem();
  private cooking = new CookingSystem();
  private powerups = new PowerUpSystem();

  private worldId = 1;
  private waveIndex = 0;
  private waveClearing = false;
  private nearStove = false;
  private cookKey!: Phaser.Input.Keyboard.Key;
  private pickupKey!: Phaser.Input.Keyboard.Key;
  private dropKey!: Phaser.Input.Keyboard.Key;
  private eHoldMs = 0;
  private recipeVisible = false;
  private recipeContainer?: Phaser.GameObjects.Container;
  private nearIngredientPrompt!: Phaser.GameObjects.Text;
  private parallax?: ParallaxBackground;
  private ultraAura!: Phaser.GameObjects.Graphics;

  constructor() {
    super('GameScene');
  }

  create(data: GameSceneData) {
    this.worldId = data.world ?? 1;
    this.waveIndex = 0;
    this.waveClearing = false;
    this.enemies = [];
    const world = WORLDS[this.worldId];
    if (world.bgLayers) {
      this.parallax = new ParallaxBackground(this, world.bgLayers);
    } else {
      this.cameras.main.setBackgroundColor(world.bgColor);
    }

    this.player = createPlayer(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, data.characterId ?? 'mimi');

    // Kompor — pojok kanan bawah agar tidak tertutup HUD
    const sx = GAME_WIDTH - 130;
    const sy = GAME_HEIGHT - 130;
    this.stoveGlow = this.add.graphics().setDepth(1);
    this.stove = this.add.image(sx, sy, 'tex-stove').setDepth(2);
    if (this.textures.exists('fire-anim')) {
      this.stoveFire = this.add.sprite(sx, sy - 68, 'fire-anim').setScale(0.7).setDepth(3);
      this.stoveFire.play('fire-burn');
    }
    this.stovePrompt = this.add
      .text(sx, sy + 48, 'Kompor\n[E] masak', { fontSize: '13px', color: '#888888', align: 'center' })
      .setOrigin(0.5, 0)
      .setDepth(4);

    this.ingredients = this.physics.add.group();
    this.cookKey = this.input.keyboard!.addKey('E');
    this.pickupKey = this.input.keyboard!.addKey('F');
    this.dropKey = this.input.keyboard!.addKey('Q');

    this.nearIngredientPrompt = this.add
      .text(0, 0, '[F] ambil', {
        fontSize: '13px', fontStyle: 'bold',
        color: '#ffd93d', stroke: '#1a1a2e', strokeThickness: 3,
      })
      .setDepth(10)
      .setVisible(false);

    this.ultraAura = this.add.graphics().setDepth(4);

    // Sistem -> HUD
    this.combo.on('change', () => this.pushHud());
    this.cooking.on('change', () => this.pushHud());
    this.powerups.on('change', () => this.pushHud());

    this.spawnWave();
    this.pushHud();

    registerPause(this);
    EventBus.emit('scene-ready', this);

    AudioManager.init(this);
    AudioManager.playBgm(`bgm-world-${this.worldId}` as Parameters<typeof AudioManager.playBgm>[0]);
  }

  private spawnWave() {
    const world = WORLDS[this.worldId];
    const wave = world.waves[this.waveIndex];
    if (!wave) return;

    for (const kind of wave.enemies) {
      const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
      const y = Phaser.Math.Between(100, GAME_HEIGHT - 100);
      this.enemies.push(this.makeEnemy(kind, x, y));
    }
  }

  private makeEnemy(kind: EnemyKind, x: number, y: number): BaseEnemy {
    switch (kind) {
      case 'besar':
        return new KokiBesar(this, x, y);
      case 'bom':
        return new KokiBom(this, x, y);
      default:
        return new KokiBiasa(this, x, y);
    }
  }

  update(_t: number, delta: number) {
    if (!this.player?.body) return;
    this.parallax?.update(this.player.x);
    // nearStove & E-key diproses paling awal: resep bisa dibuka kapan saja,
    // recipeVisible berfungsi sebagai soft-pause (update tetap jalan untuk deteksi keyup).
    this.nearStove = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.stove.x, this.stove.y) < 130;
    this.updateStoveGlow();
    this.handleEKey(delta);
    if (this.recipeVisible) return;

    if (this.player.isDead) return this.gameOver();

    this.combo.tick(delta);
    this.powerups.tick(delta);
    this.updateUltraAura();

    this.player.tick(delta, (type) => this.onPlayerAttack(type), () => EventBus.emit('special-fail'));

    const target = new Phaser.Math.Vector2(this.player.x, this.player.y);
    for (const e of this.enemies) {
      if (!e.active) continue;
      e.tick(delta, target);

      // Koki Bom: cek ledakan
      if (e instanceof KokiBom && e.tickFuse(delta)) {
        this.explode(e);
        continue;
      }

      // kontak = damage ke pemain
      if (Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 56 && e.canAttack()) {
        this.player.takeDamage(e.cfg.damage);
        this.pushHud();
      }
    }

    // pickup bahan manual [F]
    this.updateNearIngredient();
    if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) this.tryPickup();

    // drop bahan [Q]
    if (Phaser.Input.Keyboard.JustDown(this.dropKey)) this.tryDrop();

    this.checkWaveCleared();
  }

  private onPlayerAttack(type: 'light' | 'heavy' | 'special') {
    const alive = this.enemies.filter((e) => e.active);
    const prevMult = this.combo.snapshot().multiplier;
    const { hitCount, killed } = this.combat.resolveAttack(this.player, type, alive, this.powerups);

    if (hitCount > 0) {
      this.combo.registerHit();
      this.player.addEnergy(type === 'special' ? 0 : 6);
      AnimationHelper.comicPop(this, this.player.x, this.player.y - 60);
      if (this.combo.snapshot().multiplier > prevMult) AudioManager.sfx('combo');
    }
    for (const e of killed) this.killEnemy(e);
  }

  private killEnemy(e: BaseEnemy) {
    AudioManager.sfx('enemy-die');
    this.dropIngredient(e.x, e.y, e.cfg.drop as Ingredient);
    // confetti sederhana
    for (let i = 0; i < 8; i++) {
      const p = this.add.image(e.x, e.y, 'tex-pixel').setTint(Phaser.Display.Color.RandomRGB().color);
      this.tweens.add({
        targets: p,
        x: e.x + Phaser.Math.Between(-60, 60),
        y: e.y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        duration: 500,
        onComplete: () => p.destroy(),
      });
    }
    e.destroy();
    this.enemies = this.enemies.filter((x) => x !== e);
  }

  private explode(e: KokiBom) {
    const r = 120;
    AudioManager.sfx('explosion', 0.9);
    this.add.circle(e.x, e.y, r, 0xff4757, 0.5).setDepth(5);
    this.cameras.main.shake(200, 0.01);
    if (Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < r) {
      this.player.takeDamage(e.cfg.damage);
    }
    for (const other of this.enemies) {
      if (other !== e && other.active && Phaser.Math.Distance.Between(e.x, e.y, other.x, other.y) < r) {
        if (other.takeDamage(20)) this.killEnemy(other);
      }
    }
    this.killEnemy(e);
  }

  private dropIngredient(x: number, y: number, item: Ingredient) {
    const ing = this.ingredients.create(x, y, 'tex-ingredient') as Phaser.Physics.Arcade.Sprite;
    ing.setData('item', item);
    const label = this.add.text(x - 8, y - 10, item, { fontSize: '18px' }).setDepth(6);
    ing.setData('label', label);
  }

  /** Cari bahan terdekat dalam radius 80px, update prompt. */
  private updateNearIngredient() {
    let nearest: Phaser.Physics.Arcade.Sprite | null = null;
    let nearestDist = Infinity;
    for (const obj of this.ingredients.getChildren()) {
      const s = obj as Phaser.Physics.Arcade.Sprite;
      if (!s.active) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < 80 && d < nearestDist) { nearest = s; nearestDist = d; }
    }
    if (nearest) {
      this.nearIngredientPrompt.setPosition(nearest.x - 18, nearest.y - 30).setVisible(true);
    } else {
      this.nearIngredientPrompt.setVisible(false);
    }
  }

  private tryPickup() {
    let nearest: Phaser.Physics.Arcade.Sprite | null = null;
    let nearestDist = Infinity;
    for (const obj of this.ingredients.getChildren()) {
      const s = obj as Phaser.Physics.Arcade.Sprite;
      if (!s.active) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < 80 && d < nearestDist) { nearest = s; nearestDist = d; }
    }
    if (!nearest) return;
    const item = nearest.getData('item') as Ingredient;
    if (this.cooking.addIngredient(item)) {
      AudioManager.sfx('pickup');
      (nearest.getData('label') as Phaser.GameObjects.Text | undefined)?.destroy();
      nearest.destroy();
    } else {
      this.showCookFail('SLOT PENUH! (maks 4 bahan)');
    }
  }

  private tryDrop() {
    const item = this.cooking.dropLast();
    if (!item) { this.showCookFail('KANTONG KOSONG!'); return; }
    this.dropIngredient(this.player.x, this.player.y + 32, item);
  }

  /** E tahan >=1.2 detik = lihat resep (di mana saja); lepas sebelum itu + dekat kompor = masak. */
  private handleEKey(delta: number) {
    if (this.cookKey.isDown) {
      this.eHoldMs += delta;
      if (this.eHoldMs >= 1200 && !this.recipeVisible) this.showRecipe();
    } else if (this.eHoldMs > 0) {
      if (!this.recipeVisible && this.nearStove) this.tryCook();
      this.hideRecipe();
      this.eHoldMs = 0;
    }
  }

  private showRecipe() {
    if (this.recipeVisible) return;
    this.recipeVisible = true;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const w = 400; const h = 290;
    const bg = this.add.graphics()
      .fillStyle(0x1a1a2e, 0.93).fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 16)
      .lineStyle(3, 0xffd93d, 1).strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 16);
    const title = this.add.text(cx, cy - h / 2 + 22, '📖 BUKU RESEP', {
      fontSize: '22px', fontStyle: 'bold', color: '#ffd93d',
    }).setOrigin(0.5);
    const rows = [
      '🍗 + 🌶️  →  Ayam Geprek  (DMG ×1.5)',
      '🍅 + 🧅  →  Sambal  (serangan AOE)',
      '🍳 + 🧀  →  Omelet  (+40 HP)',
      '🍌 + 🍦  →  Es Pisang  (bekukan musuh)',
      '4 bahan BERBEDA  →  ✨ NASI GORENG KOSMIK ✨  (DMG ×3!)',
    ];
    const rowItems = rows.map((r, i) =>
      this.add.text(cx, cy - h / 2 + 64 + i * 36, r, {
        fontSize: '14px', color: '#ffffff', align: 'center',
      }).setOrigin(0.5),
    );
    const hint = this.add.text(cx, cy + h / 2 - 18, 'Lepas [E] untuk menutup', {
      fontSize: '12px', color: '#888888',
    }).setOrigin(0.5);
    this.recipeContainer = this.add.container(0, 0, [bg, title, ...rowItems, hint]).setDepth(30);
  }

  private hideRecipe() {
    this.recipeContainer?.destroy();
    this.recipeContainer = undefined;
    this.recipeVisible = false;
  }

  private tryCook() {
    const result = this.cooking.cook();
    if (!result) return;

    // Gagal masak: tampilkan alasan selama 1.5 detik
    if (typeof result === 'string') {
      this.showCookFail(result);
      return;
    }

    this.powerups.apply(result);
    if (result.healOnApply) this.player.hp = Math.min(this.player.maxHp, this.player.hp + result.healOnApply);
    AudioManager.sfx('cook');
    this.time.delayedCall(400, () => AudioManager.sfx('powerup'));
    this.cameras.main.flash(250, 255, 217, 61);
    const t = this.add
      .text(GAME_WIDTH / 2, 200, `🍳 ${result.dish}!`, { fontSize: '40px', fontStyle: 'bold', color: '#ff4757' })
      .setOrigin(0.5)
      .setDepth(20);
    this.time.delayedCall(1800, () => t.destroy());
    this.pushHud();
  }

  private showCookFail(reason: string) {
    const t = this.add
      .text(GAME_WIDTH / 2, 220, `❌ ${reason}`, {
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ff4757',
        stroke: '#1a1a2e',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(1);
    this.tweens.add({ targets: t, alpha: 0, duration: 1400, delay: 400, onComplete: () => t.destroy() });
  }

  /** Glow kuning jika dekat kompor, mati jika jauh. */
  private updateStoveGlow() {
    if (!this.stoveGlow?.active) return;
    this.stoveGlow.clear();
    if (this.nearStove) {
      // Lingkaran glow kuning berkedip
      const pulse = 0.3 + 0.2 * Math.sin(this.time.now / 200);
      this.stoveGlow
        .fillStyle(0xffd93d, pulse)
        .fillCircle(this.stove.x, this.stove.y, 52);
      this.stovePrompt.setText('Kompor\n[E] MASAK!').setColor('#ffd93d');
    } else {
      this.stovePrompt.setText('Kompor\n[E] masak').setColor('#888888');
    }
  }

  /** Aura emas berkedip di sekeliling pemain selama power-up Ultra aktif. */
  private updateUltraAura() {
    if (!this.ultraAura?.active) return;
    this.ultraAura.clear();
    if (!this.powerups.has('ultra')) return;
    const pulse = 0.25 + 0.18 * Math.sin(this.time.now / 110);
    this.ultraAura
      .lineStyle(3, 0xffd93d, pulse + 0.45)
      .strokeCircle(this.player.x, this.player.y, 46)
      .fillStyle(0xffd93d, pulse * 0.28)
      .fillCircle(this.player.x, this.player.y, 46);
  }

  private checkWaveCleared() {
    if (this.waveClearing) return;
    if (this.enemies.some((e) => e.active)) return;
    this.waveClearing = true;

    const world = WORLDS[this.worldId];
    this.waveIndex += 1;

    if (this.waveIndex < world.waves.length) {
      AudioManager.sfx('wave-start');
      EventBus.emit('wave-start', { wave: this.waveIndex + 1, totalWaves: world.waves.length });
      this.time.delayedCall(1500, () => {
        this.waveClearing = false;
        this.spawnWave();
        this.pushHud();
      });
    } else {
      // semua wave selesai -> boss
      this.scene.start('BossScene', { characterId: this.player.def.id, world: this.worldId });
    }
  }

  private gameOver() {
    AudioManager.stopBgm();
    AudioManager.sfx('gameover');
    this.scene.start('GameOverScene', { score: this.combo.snapshot().score, world: this.worldId });
  }

  private pushHud() {
    EventBus.emit('hud', {
      hp: Math.round(this.player.hp),
      maxHp: this.player.maxHp,
      energy: this.player.energy,
      combo: this.combo.snapshot(),
      ingredients: this.cooking.slots,
      world: this.worldId,
      wave: this.waveIndex + 1,
      totalWaves: WORLDS[this.worldId].waves.length,
      powerups: this.powerups.list(),
      isBoss: false,
    });
  }
}
