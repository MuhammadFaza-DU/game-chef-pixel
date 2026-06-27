import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { CHARACTERS, type CharacterId } from '../entities/characters';
import { EventBus } from '../EventBus';
import { getTargetWorld } from '../targetWorld';

const CARD_COLORS: Record<CharacterId, { neon: number; dark: number }> = {
  mimi: { neon: 0x00f5ff, dark: 0x060e18 },
  bobo: { neon: 0xffd93d, dark: 0x120d00 },
  lala: { neon: 0xff3cac, dark: 0x12040e },
};

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create(data?: { world?: number }) {
    const targetWorld = data?.world ?? getTargetWorld();
    this.cameras.main.setBackgroundColor('#08081a');

    this.addScanlines();
    this.addTitle();

    if (targetWorld > 1) {
      this.add.text(GAME_WIDTH / 2, 128, `▶ Akan memulai dari World ${targetWorld}`, {
        fontSize: '20px',
        color: '#ffd93d',
      }).setOrigin(0.5).setAlpha(0.9);
    }

    const ids = Object.keys(CHARACTERS) as CharacterId[];
    const spacing = GAME_WIDTH / (ids.length + 1);

    ids.forEach((id, i) => {
      const x = spacing * (i + 1);
      const y = GAME_HEIGHT / 2;
      this.createCharacterCard(x, y, id, CHARACTERS[id], targetWorld);
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'Klik kartu untuk memilih', {
      fontSize: '22px',
      color: '#00f5ff',
    }).setOrigin(0.5).setAlpha(0.85);
  }

  private addScanlines() {
    const g = this.add.graphics();
    g.lineStyle(1, 0x000000, 0.15);
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(GAME_WIDTH, y);
      g.strokePath();
    }
  }

  private addTitle() {
    const shadow = this.add.text(GAME_WIDTH / 2 + 3, 83, 'PILIH CHEF-MU', {
      fontSize: '54px',
      fontStyle: 'bold',
      color: '#ff3cac',
    }).setOrigin(0.5).setAlpha(0.45);

    const title = this.add.text(GAME_WIDTH / 2, 80, 'PILIH CHEF-MU', {
      fontSize: '54px',
      fontStyle: 'bold',
      color: '#00f5ff',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        if (Math.random() < 0.03) {
          const offset = Phaser.Math.Between(-4, 4);
          title.setPosition(GAME_WIDTH / 2 + offset, 80);
          title.setColor('#ff3cac');
          shadow.setColor('#00f5ff');
          this.time.delayedCall(60, () => {
            title.setPosition(GAME_WIDTH / 2, 80);
            title.setColor('#00f5ff');
            shadow.setColor('#ff3cac');
          });
        }
      },
    });
  }

  private createCharacterCard(
    x: number, y: number,
    id: CharacterId,
    c: typeof CHARACTERS[CharacterId],
    targetWorld: number,
  ) {
    const w = 262;
    const h = 358;
    const colors = CARD_COLORS[id];
    const neonHex = '#' + colors.neon.toString(16).padStart(6, '0');

    const container = this.add.container(x, y);

    const cardBg = this.add.graphics();
    this.drawCardBg(cardBg, w, h, colors.dark, colors.neon);
    container.add(cardBg);

    const charGfx = this.add.graphics();
    charGfx.setPosition(0, -65);
    this.drawCharacter(charGfx, id, colors.neon);
    container.add(charGfx);

    const sep = this.add.graphics();
    sep.lineStyle(2, colors.neon, 0.5);
    sep.beginPath();
    sep.moveTo(-w / 2 + 20, 22);
    sep.lineTo(w / 2 - 20, 22);
    sep.strokePath();
    container.add(sep);

    const nameText = this.add.text(0, 42, c.name, {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);
    container.add(nameText);

    const titleText = this.add.text(0, 95, c.title, {
      fontSize: '19px',
      color: '#b0b0d0',
      align: 'center',
      wordWrap: { width: w - 36 },
      lineSpacing: 5,
    }).setOrigin(0.5);
    container.add(titleText);

    const statsText = this.add.text(
      0, 155,
      `SPD ${c.stats.speed}  PWR ${c.stats.power}  DEF ${c.stats.defense}`,
      { fontSize: '20px', fontStyle: 'bold', color: neonHex },
    ).setOrigin(0.5);
    container.add(statsText);

    const hit = this.add.rectangle(0, 0, w, h, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    container.add(hit);

    hit.on('pointerover', () => {
      this.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 100, ease: 'Power1' });
    });
    hit.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100, ease: 'Power1' });
    });
    hit.on('pointerdown', () => {
      EventBus.emit('character-selected', id);
      this.scene.start('GameScene', { characterId: id, world: targetWorld });
    });
  }

  private drawCardBg(
    g: Phaser.GameObjects.Graphics,
    w: number, h: number,
    dark: number, neon: number,
  ) {
    const hw = w / 2, hh = h / 2;
    const corner = 10;

    g.fillStyle(dark, 1);
    g.fillRect(-hw, -hh, w, h);

    g.lineStyle(3, neon, 0.85);
    g.strokeRect(-hw, -hh, w, h);

    g.lineStyle(1, neon, 0.22);
    g.strokeRect(-hw + 6, -hh + 6, w - 12, h - 12);

    // Corner accent squares
    g.fillStyle(neon, 1);
    const corners: [number, number][] = [
      [-hw, -hh], [hw - corner, -hh],
      [-hw, hh - corner], [hw - corner, hh - corner],
    ];
    corners.forEach(([cx, cy]) => g.fillRect(cx, cy, corner, corner));

    // Top accent line
    g.lineStyle(1, neon, 0.35);
    g.beginPath();
    g.moveTo(-hw + corner, -hh + 2);
    g.lineTo(hw - corner, -hh + 2);
    g.strokePath();
  }

  private drawCharacter(g: Phaser.GameObjects.Graphics, id: CharacterId, neon: number) {
    if (id === 'mimi') this.drawMimi(g, neon);
    else if (id === 'bobo') this.drawBobo(g, neon);
    else this.drawLala(g, neon);
  }

  /** Mimi: slim noodle chef, pigtails, holding bowl */
  private drawMimi(g: Phaser.GameObjects.Graphics, neon: number) {
    const INK = 0x000000;
    const skin = 0xffe0c0;

    g.fillStyle(INK, 0.18).fillEllipse(0, 98, 76, 12);

    g.fillStyle(neon, 0.9).lineStyle(3, INK, 1);
    g.fillRoundedRect(-20, 6, 40, 82, 10);
    g.strokeRoundedRect(-20, 6, 40, 82, 10);

    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(-12, 14, 24, 58, 5);

    g.fillStyle(0x2a1800, 1).fillRect(-20, 55, 40, 6);

    // Pigtails
    g.fillStyle(0x4a2000, 1);
    g.fillEllipse(-30, -35, 14, 30);
    g.fillEllipse(-35, -18, 12, 22);
    g.fillEllipse(30, -35, 14, 30);
    g.fillEllipse(35, -18, 12, 22);

    g.fillStyle(skin, 1).lineStyle(3, INK, 1);
    g.fillCircle(0, -28, 25);
    g.strokeCircle(0, -28, 25);

    // Eyes
    g.fillStyle(INK, 1);
    g.fillCircle(-8, -30, 4);
    g.fillCircle(8, -30, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-7, -31, 1.5);
    g.fillCircle(9, -31, 1.5);

    g.lineStyle(2.5, INK, 1).beginPath();
    g.arc(0, -20, 9, 0.1 * Math.PI, 0.9 * Math.PI);
    g.strokePath();

    // Chef hat
    g.fillStyle(0xffffff, 1).lineStyle(3, INK, 1);
    g.fillRect(-18, -68, 36, 10);
    g.strokeRect(-18, -68, 36, 10);
    g.fillRoundedRect(-14, -108, 28, 44, 7);
    g.strokeRoundedRect(-14, -108, 28, 44, 7);

    // Noodle bowl (left hand)
    g.fillStyle(0xffd93d, 1).lineStyle(2, INK, 1);
    g.fillEllipse(-36, 38, 24, 10);
    g.strokeEllipse(-36, 38, 24, 10);
    g.fillStyle(0xff4757, 0.8).fillEllipse(-36, 34, 18, 8);
    g.lineStyle(2, 0xffffff, 0.9);
    g.beginPath(); g.arc(-38, 33, 5, Math.PI, 0, true); g.strokePath();
    g.lineStyle(2, neon, 0.9);
    g.beginPath(); g.arc(-33, 34, 5, Math.PI, 0, true); g.strokePath();

    g.fillStyle(skin, 1).lineStyle(2, INK, 1);
    g.fillCircle(-28, 44, 8);
    g.strokeCircle(-28, 44, 8);

    // Right hand waving
    g.fillCircle(32, 22, 9);
    g.strokeCircle(32, 22, 9);
  }

  /** Bobo: beefy grill king */
  private drawBobo(g: Phaser.GameObjects.Graphics, neon: number) {
    const INK = 0x000000;
    const skin = 0xffd0a0;

    g.fillStyle(INK, 0.22).fillEllipse(0, 102, 104, 18);

    g.fillStyle(neon, 0.9).lineStyle(4, INK, 1);
    g.fillRoundedRect(-36, 6, 72, 90, 14);
    g.strokeRoundedRect(-36, 6, 72, 90, 14);

    g.fillStyle(0xffffff, 0.85);
    g.fillRoundedRect(-20, 14, 40, 66, 6);

    g.fillStyle(0x1a0e00, 1).fillRect(-36, 62, 72, 10);

    // Belt buckle
    g.fillStyle(neon, 1).lineStyle(2, INK, 1);
    g.fillRect(-8, 60, 16, 14);
    g.strokeRect(-8, 60, 16, 14);

    g.fillStyle(skin, 1).lineStyle(4, INK, 1);
    g.fillCircle(0, -32, 33);
    g.strokeCircle(0, -32, 33);

    // Angry brows
    g.fillStyle(0x2e1800, 1);
    g.fillRect(-22, -46, 16, 6);
    g.fillRect(6, -46, 16, 6);

    g.fillStyle(INK, 1);
    g.fillCircle(-11, -33, 5.5);
    g.fillCircle(11, -33, 5.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-9, -35, 2);
    g.fillCircle(13, -35, 2);

    // Mustache
    g.lineStyle(3.5, 0x2e1800, 1);
    g.beginPath(); g.moveTo(-12, -18); g.lineTo(-3, -16); g.strokePath();
    g.beginPath(); g.moveTo(12, -18); g.lineTo(3, -16); g.strokePath();

    g.lineStyle(3, INK, 1).beginPath();
    g.arc(0, -18, 13, 0.1 * Math.PI, 0.9 * Math.PI);
    g.strokePath();

    // Chef hat (wide)
    g.fillStyle(0xffffff, 1).lineStyle(4, INK, 1);
    g.fillRect(-26, -70, 52, 12);
    g.strokeRect(-26, -70, 52, 12);
    g.fillRoundedRect(-20, -118, 40, 50, 9);
    g.strokeRoundedRect(-20, -118, 40, 50, 9);

    // Spatula (right hand)
    g.lineStyle(4, 0x999999, 1);
    g.beginPath(); g.moveTo(40, 52); g.lineTo(48, 10); g.strokePath();
    g.fillStyle(0xbbbbbb, 1).lineStyle(2, INK, 1);
    g.fillRect(40, 4, 14, 8);
    g.strokeRect(40, 4, 14, 8);

    g.fillStyle(skin, 1).lineStyle(3, INK, 1);
    g.fillCircle(39, 50, 11);
    g.strokeCircle(39, 50, 11);

    // Fire
    g.fillStyle(0xff4757, 0.9).fillTriangle(-48, 58, -36, 58, -42, 40);
    g.fillStyle(0xffa502, 0.9).fillTriangle(-46, 58, -38, 58, -42, 46);
    g.fillStyle(0xffd93d, 0.9).fillTriangle(-44, 58, -40, 58, -42, 52);
  }

  /** Lala: pastry puncher */
  private drawLala(g: Phaser.GameObjects.Graphics, neon: number) {
    const INK = 0x000000;
    const skin = 0xffe8c8;

    g.fillStyle(INK, 0.18).fillEllipse(0, 100, 88, 14);

    g.fillStyle(neon, 0.9).lineStyle(3, INK, 1);
    g.fillRoundedRect(-25, 6, 50, 88, 11);
    g.strokeRoundedRect(-25, 6, 50, 88, 11);

    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(-16, 14, 32, 62, 5);

    // Apron lace
    for (let rx = -16; rx < 16; rx += 8) {
      g.fillStyle(neon, 0.55).fillCircle(rx + 4, 74, 4);
    }

    g.fillStyle(0x4a006a, 1).fillRect(-25, 56, 50, 7);

    g.fillStyle(skin, 1).lineStyle(3, INK, 1);
    g.fillCircle(0, -30, 26);
    g.strokeCircle(0, -30, 26);

    // Blush
    g.fillStyle(0xff9db8, 0.4);
    g.fillCircle(-16, -22, 7);
    g.fillCircle(16, -22, 7);

    g.fillStyle(INK, 1);
    g.fillCircle(-9, -32, 4);
    g.fillCircle(9, -32, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-8, -33, 1.5);
    g.fillCircle(10, -33, 1.5);

    g.lineStyle(2.5, INK, 1).beginPath();
    g.arc(0, -22, 9, 0.1 * Math.PI, 0.9 * Math.PI);
    g.strokePath();

    // Fancy toque
    g.fillStyle(0xffffff, 1).lineStyle(3, INK, 1);
    g.fillRect(-20, -66, 40, 10);
    g.strokeRect(-20, -66, 40, 10);
    g.fillRoundedRect(-16, -114, 32, 50, 9);
    g.strokeRoundedRect(-16, -114, 32, 50, 9);
    g.lineStyle(1.5, neon, 0.5);
    g.strokeRect(-12, -110, 24, 40);

    // Cake (left hand)
    g.fillStyle(0xffd93d, 1).lineStyle(2, INK, 1);
    g.fillRect(-46, 44, 24, 20);
    g.strokeRect(-46, 44, 24, 20);
    g.fillStyle(neon, 0.75).fillRect(-46, 40, 24, 6);
    g.strokeRect(-46, 40, 24, 6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-40, 38, 4); g.fillCircle(-34, 36, 4); g.fillCircle(-28, 38, 4);
    g.fillStyle(0xff4757, 1).fillCircle(-34, 32, 4);
    g.lineStyle(2, 0x006600, 1).beginPath();
    g.moveTo(-34, 28); g.lineTo(-32, 22); g.strokePath();

    g.fillStyle(skin, 1).lineStyle(2, INK, 1);
    g.fillCircle(-34, 58, 8);
    g.strokeCircle(-34, 58, 8);

    // Right fist
    g.fillStyle(skin, 1).lineStyle(2, INK, 1);
    g.fillRoundedRect(28, 14, 18, 16, 5);
    g.strokeRoundedRect(28, 14, 18, 16, 5);
    g.fillStyle(neon, 0.55);
    g.fillRect(28, 14, 4, 5); g.fillRect(28, 20, 4, 5); g.fillRect(28, 26, 4, 5);
  }
}
