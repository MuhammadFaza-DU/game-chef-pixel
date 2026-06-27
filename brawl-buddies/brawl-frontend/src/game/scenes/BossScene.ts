import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { EventBus } from '../EventBus';
import { createPlayer } from '../entities/createPlayer';
import type Player from '../entities/Player';
import type { CharacterId } from '../entities/characters';
import BaseEnemy from '../entities/enemies/BaseEnemy';
import CombatSystem from '../systems/CombatSystem';
import ComboSystem from '../systems/ComboSystem';
import CookingSystem, { type Ingredient } from '../systems/CookingSystem';
import PowerUpSystem from '../systems/PowerUpSystem';
import { WORLDS } from '../levels';
import ChefRobotMicro from '../entities/enemies/bosses/ChefRobotMicro';
import KasirMutan from '../entities/enemies/bosses/KasirMutan';
import DuoMCMakan from '../entities/enemies/bosses/DuoMCMakan';
import ChefBesarMangkukJahat from '../entities/enemies/bosses/ChefBesarMangkukJahat';
import { AnimationHelper } from '../utils/AnimationHelper';
import { registerPause } from '../utils/pauseControls';
import { ParallaxBackground } from '../utils/ParallaxBackground';
import AudioManager from '../systems/AudioManager';

interface BossSceneData {
  characterId: CharacterId;
  world: number;
}

const BOSS_MAP = {
  ChefRobotMicro,
  KasirMutan,
  DuoMCMakan,
  ChefBesarMangkukJahat,
} as const;

const INGREDIENTS: Ingredient[] = ['🍅', '🧅', '🍗', '🌶️', '🍳', '🧀', '🍌', '🍦'];

/** Boss fight per world. Kalahkan boss -> modal World Clear (lanjut / reselect / simpan-keluar). */
export default class BossScene extends Phaser.Scene {
  private player!: Player;
  private boss!: BaseEnemy & { maxHp?: number };
  private bossB?: DuoMCMakan;
  private bossMaxHp = 0;
  private bossBMaxHp = 0;
  private combat = new CombatSystem();
  private combo = new ComboSystem();
  private cooking = new CookingSystem();
  private powerups = new PowerUpSystem();
  private worldId = 1;
  private defeated = false;

  private ingredients!: Phaser.Physics.Arcade.Group;
  private stove!: Phaser.GameObjects.Image;
  private stoveFire?: Phaser.GameObjects.Sprite;
  private stoveGlow!: Phaser.GameObjects.Graphics;
  private stovePrompt!: Phaser.GameObjects.Text;
  private cookKey!: Phaser.Input.Keyboard.Key;
  private pickupKey!: Phaser.Input.Keyboard.Key;
  private dropKey!: Phaser.Input.Keyboard.Key;
  private nearStove = false;
  private eHoldMs = 0;
  private recipeVisible = false;
  private recipeContainer?: Phaser.GameObjects.Container;
  private nearIngredientPrompt!: Phaser.GameObjects.Text;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private parallax?: ParallaxBackground;

  constructor() {
    super('BossScene');
  }

  create(data: BossSceneData) {
    this.worldId = data.world ?? 1;
    this.defeated = false;
    const world = WORLDS[this.worldId];
    if (world.bgLayers) {
      this.parallax = new ParallaxBackground(this, world.bgLayers, 0.7);
      this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.35).setOrigin(0, 0).setDepth(-5);
    } else {
      this.cameras.main.setBackgroundColor(world.bgColor);
    }

    this.add
      .text(GAME_WIDTH / 2, 60, `BOSS — ${world.name}`, {
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#ff4757',
        stroke: '#1a1a2e',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.player = createPlayer(this, GAME_WIDTH / 2, GAME_HEIGHT - 120, data.characterId ?? 'mimi');

    if (world.bossKey === 'DuoMCMakan') {
      this.boss = new DuoMCMakan(this, GAME_WIDTH / 2 - 110, 180, 'besar') as BaseEnemy & { maxHp?: number };
      this.boss.setTexture('tex-boss');
      this.bossB = new DuoMCMakan(this, GAME_WIDTH / 2 + 110, 180, 'kecil');
      this.bossB.setTexture('tex-boss');
      this.bossBMaxHp = this.bossB.cfg.hp;
    } else {
      const BossClass = BOSS_MAP[world.bossKey];
      this.boss = new BossClass(this, GAME_WIDTH / 2, 200) as BaseEnemy & { maxHp?: number };
      this.boss.setTexture('tex-boss');
    }
    this.bossMaxHp = this.boss.cfg.hp;

    // Kompor + bahan — pojok kanan bawah
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
      .setDepth(7);
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
    this.cooking.on('change', () => this.pushHud());
    this.powerups.on('change', () => this.pushHud());
    this.spawnTimer = this.time.addEvent({ delay: 3500, loop: true, callback: () => this.spawnIngredient() });
    this.spawnIngredient();

    this.emitBossState();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => EventBus.emit('boss-clear'));
    registerPause(this);
    this.registerWorldClearActions();
    this.pushHud();

    AudioManager.init(this);
    AudioManager.sfx('boss-appear');
    this.time.delayedCall(800, () => AudioManager.playBgm('bgm-boss'));
  }

  update(_t: number, delta: number) {
    if (!this.player?.body) return;
    this.parallax?.update(this.player.x);
    if (this.defeated) return;

    // nearStove & E-key diproses paling awal: resep bisa dibuka kapan saja,
    // recipeVisible berfungsi sebagai soft-pause.
    this.nearStove = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.stove.x, this.stove.y) < 130;
    this.updateStoveGlow();
    this.handleEKey(delta);
    if (this.recipeVisible) return;

    if (this.player.isDead) {
      return this.scene.start('GameOverScene', { score: this.combo.snapshot().score, world: this.worldId });
    }

    this.combo.tick(delta);
    this.powerups.tick(delta);

    // player.tick dipanggil TERPISAH dari boss.tick:
    // callback onPlayerAttack bisa men-destroy boss & set defeated=true,
    // lalu cek ulang sebelum menyentuh boss (cegah akses objek null → freeze).
    if (this.boss.active) {
      this.player.tick(delta, (type) => this.onPlayerAttack(type), () => EventBus.emit('special-fail'));
    }
    if (!this.defeated && this.boss.active) {
      this.boss.tick(delta, new Phaser.Math.Vector2(this.player.x, this.player.y));
      if (
        this.boss.hp > 0 &&
        Phaser.Math.Distance.Between(this.boss.x, this.boss.y, this.player.x, this.player.y) < 80 &&
        this.boss.canAttack()
      ) {
        this.player.takeDamage(this.boss.cfg.damage);
      }
    }
    if (!this.defeated && this.bossB?.active) {
      this.bossB.tick(delta, new Phaser.Math.Vector2(this.player.x, this.player.y));
      if (
        this.bossB.hp > 0 &&
        Phaser.Math.Distance.Between(this.bossB.x, this.bossB.y, this.player.x, this.player.y) < 65 &&
        this.bossB.canAttack()
      ) {
        this.player.takeDamage(this.bossB.cfg.damage);
      }
    }

    // pickup bahan manual [F]
    this.updateNearIngredient();
    if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) this.tryPickup();

    // drop bahan [Q]
    if (Phaser.Input.Keyboard.JustDown(this.dropKey)) this.tryDrop();

    this.pushHud();
  }

  private onPlayerAttack(type: 'light' | 'heavy' | 'special') {
    if (this.defeated) return;
    const targets: BaseEnemy[] = [];
    if (this.boss.active && this.boss.hp > 0) targets.push(this.boss);
    if (this.bossB?.active && this.bossB.hp > 0) targets.push(this.bossB);
    if (targets.length === 0) return;

    const { hitCount } = this.combat.resolveAttack(this.player, type, targets, this.powerups);
    if (hitCount === 0) return;

    AudioManager.sfx(type === 'special' ? 'hit-special' : 'hit-heavy', 0.85);
    this.combo.registerHit();
    this.player.addEnergy(type === 'special' ? 0 : 6);
    AnimationHelper.comicPop(this, this.boss.x, this.boss.y - 70, ['WHAM!', 'KO!', 'DUAR!']);
    if (this.boss instanceof ChefBesarMangkukJahat) this.boss.updatePhase();
    this.emitBossState();

    const primaryDead = this.boss.hp <= 0;
    const secondaryDead = !this.bossB || this.bossB.hp <= 0;
    if (primaryDead && secondaryDead) this.defeatBoss();
  }

  private spawnIngredient() {
    if (this.defeated) return;
    const item = Phaser.Utils.Array.GetRandom(INGREDIENTS) as Ingredient;
    const x = Phaser.Math.Between(140, GAME_WIDTH - 140);
    const y = Phaser.Math.Between(180, GAME_HEIGHT - 120);
    const ing = this.ingredients.create(x, y, 'tex-ingredient') as Phaser.Physics.Arcade.Sprite;
    ing.setData('item', item);
    const label = this.add.text(x - 8, y - 10, item, { fontSize: '18px' }).setDepth(6);
    ing.setData('label', label);
  }

  private tryCook() {
    const result = this.cooking.cook();
    if (!result) return;

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
      .text(GAME_WIDTH / 2, 220, `🍳 ${result.dish}!`, { fontSize: '40px', fontStyle: 'bold', color: '#ff4757' })
      .setOrigin(0.5)
      .setDepth(20);
    this.time.delayedCall(1800, () => t.destroy());
    this.pushHud();
  }

  private showCookFail(reason: string) {
    const t = this.add
      .text(GAME_WIDTH / 2, 260, `❌ ${reason}`, {
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ff4757',
        stroke: '#1a1a2e',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.tweens.add({ targets: t, alpha: 0, duration: 1400, delay: 400, onComplete: () => t.destroy() });
  }

  private updateStoveGlow() {
    if (!this.stoveGlow?.active) return;
    this.stoveGlow.clear();
    if (this.nearStove) {
      const pulse = 0.3 + 0.2 * Math.sin(this.time.now / 200);
      this.stoveGlow
        .fillStyle(0xffd93d, pulse)
        .fillCircle(this.stove.x, this.stove.y, 52);
      this.stovePrompt.setText('Kompor\n[E] MASAK!').setColor('#ffd93d');
    } else {
      this.stovePrompt.setText('Kompor\n[E] masak').setColor('#888888');
    }
  }

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
    const ing = this.ingredients.create(this.player.x, this.player.y + 32, 'tex-ingredient') as Phaser.Physics.Arcade.Sprite;
    ing.setData('item', item);
    const label = this.add.text(this.player.x - 8, this.player.y + 22, item, { fontSize: '18px' }).setDepth(6);
    ing.setData('label', label);
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

  private defeatBoss() {
    if (this.defeated) return;
    this.defeated = true;
    this.spawnTimer?.remove();
    this.boss.destroy();
    this.bossB?.destroy();
    AudioManager.stopBgm();
    AudioManager.sfx('world-clear', 0.9);
    this.cameras.main.flash(400, 255, 255, 255);
    EventBus.emit('boss-clear');

    const next = this.worldId + 1;
    const score = this.combo.snapshot().score;

    if (WORLDS[next]) {
      this.time.delayedCall(700, () => {
        this.scene.pause();
        EventBus.emit('world-clear', { world: this.worldId, score, character: this.player.def.id });
      });
    } else {
      this.scene.start('GameOverScene', { score, world: this.worldId, win: true });
    }
  }

  private emitBossState() {
    const payload: {
      name: string; hp: number; maxHp: number;
      bossB?: { hp: number; maxHp: number };
    } = {
      name: WORLDS[this.worldId].bossKey,
      hp: Math.max(0, this.boss.hp),
      maxHp: this.bossMaxHp,
    };
    if (this.bossB) {
      payload.bossB = { hp: Math.max(0, this.bossB.hp), maxHp: this.bossBMaxHp };
    }
    EventBus.emit('boss', payload);
  }

  /** Aksi dari modal World Clear (React) -> dieksekusi di sisi Phaser. */
  private registerWorldClearActions() {
    const onNext = () => {
      cleanup();
      this.scene.resume();
      this.scene.start('GameScene', { characterId: this.player.def.id, world: this.worldId + 1 });
    };
    const onReselect = () => {
      cleanup();
      this.scene.resume();
      this.scene.start('CharacterSelectScene', { world: this.worldId + 1 });
    };
    const onSaveExit = () => cleanup();

    const cleanup = () => {
      EventBus.off('world-clear:next', onNext);
      EventBus.off('world-clear:reselect', onReselect);
      EventBus.off('world-clear:save-exit', onSaveExit);
    };

    EventBus.on('world-clear:next', onNext);
    EventBus.on('world-clear:reselect', onReselect);
    EventBus.on('world-clear:save-exit', onSaveExit);

    // Backup cleanup: SHUTDOWN fires ketika scene di-stop atau game di-destroy
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
  }

  private pushHud() {
    EventBus.emit('hud', {
      hp: Math.round(this.player.hp),
      maxHp: this.player.maxHp,
      energy: this.player.energy,
      combo: this.combo.snapshot(),
      ingredients: this.cooking.slots,
      world: this.worldId,
      wave: 1,
      totalWaves: 1,
      powerups: this.powerups.list(),
      isBoss: true,
    });
  }
}
