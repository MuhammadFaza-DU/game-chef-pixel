import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

type ArenaTheme = {
  base: number;
  tileA: number;
  tileB: number;
  grout: number;
  wall: number;
  wallTrim: number;
  accent: number;
  accent2: number;
  shadow: number;
};

const THEMES: Record<number, ArenaTheme> = {
  1: {
    base: 0xf4ead8,
    tileA: 0xfff0d8,
    tileB: 0xf5dcc0,
    grout: 0xd2a97b,
    wall: 0x8f5a3c,
    wallTrim: 0x5b3326,
    accent: 0xff4757,
    accent2: 0x00c2ff,
    shadow: 0x6b3e2e,
  },
  2: {
    base: 0xf6f3d2,
    tileA: 0xfff7c4,
    tileB: 0xe8f2c4,
    grout: 0x9fb071,
    wall: 0x4e8f67,
    wallTrim: 0x2c5f4a,
    accent: 0xffa502,
    accent2: 0xff4757,
    shadow: 0x315b49,
  },
  3: {
    base: 0x251346,
    tileA: 0x33205f,
    tileB: 0x24133f,
    grout: 0x594087,
    wall: 0x121226,
    wallTrim: 0xffd93d,
    accent: 0xff4fd8,
    accent2: 0x00f5ff,
    shadow: 0x070711,
  },
  4: {
    base: 0x1a1a2e,
    tileA: 0x24233f,
    tileB: 0x17182a,
    grout: 0x45405f,
    wall: 0x0e1020,
    wallTrim: 0xffd93d,
    accent: 0xff4757,
    accent2: 0x9b59ff,
    shadow: 0x05050b,
  },
};

export class ArenaBackground {
  private objects: Phaser.GameObjects.GameObject[] = [];

  constructor(private scene: Phaser.Scene, private worldId: number, private alpha = 1) {
    this.draw();
  }

  destroy() {
    this.objects.forEach((obj) => obj.destroy());
    this.objects = [];
  }

  private add<T extends Phaser.GameObjects.GameObject>(obj: T) {
    this.objects.push(obj);
    return obj;
  }

  private draw() {
    const theme = THEMES[this.worldId] ?? THEMES[1];
    this.scene.cameras.main.setBackgroundColor(theme.base);

    this.drawFloor(theme);
    this.drawWalls(theme);

    if (this.worldId === 1) this.drawKitchen(theme);
    else if (this.worldId === 2) this.drawMarket(theme);
    else if (this.worldId === 3) this.drawFestival(theme);
    else this.drawFinalKitchen(theme);

    this.drawPlayAreaGuide(theme);
  }

  private graphics(depth: number) {
    return this.add(this.scene.add.graphics().setDepth(depth).setAlpha(this.alpha));
  }

  private drawFloor(theme: ArenaTheme) {
    const g = this.graphics(-30);
    g.fillStyle(theme.base, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const tile = 64;
    for (let y = 0; y < GAME_HEIGHT; y += tile) {
      for (let x = 0; x < GAME_WIDTH; x += tile) {
        const color = ((x / tile + y / tile) % 2 === 0) ? theme.tileA : theme.tileB;
        g.fillStyle(color, 1).fillRect(x, y, tile, tile);
      }
    }

    g.lineStyle(2, theme.grout, 0.32);
    for (let x = 0; x <= GAME_WIDTH; x += tile) {
      g.beginPath().moveTo(x, 0).lineTo(x, GAME_HEIGHT).strokePath();
    }
    for (let y = 0; y <= GAME_HEIGHT; y += tile) {
      g.beginPath().moveTo(0, y).lineTo(GAME_WIDTH, y).strokePath();
    }
  }

  private drawWalls(theme: ArenaTheme) {
    const g = this.graphics(-25);
    const top = 34;
    const side = 28;
    const bottom = 24;

    g.fillStyle(theme.wall, 1);
    g.fillRect(0, 0, GAME_WIDTH, top);
    g.fillRect(0, GAME_HEIGHT - bottom, GAME_WIDTH, bottom);
    g.fillRect(0, 0, side, GAME_HEIGHT);
    g.fillRect(GAME_WIDTH - side, 0, side, GAME_HEIGHT);

    g.lineStyle(5, theme.wallTrim, 0.9);
    g.strokeRect(side, top, GAME_WIDTH - side * 2, GAME_HEIGHT - top - bottom);

    g.fillStyle(theme.shadow, 0.22);
    g.fillRect(side, top, GAME_WIDTH - side * 2, 16);
    g.fillRect(side, GAME_HEIGHT - bottom - 16, GAME_WIDTH - side * 2, 16);
  }

  private drawCounter(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, body: number, trim: number) {
    g.fillStyle(0x000000, 0.16).fillRoundedRect(x + 6, y + 8, w, h, 8);
    g.fillStyle(body, 1).lineStyle(3, trim, 1);
    g.fillRoundedRect(x, y, w, h, 8);
    g.strokeRoundedRect(x, y, w, h, 8);
    g.lineStyle(2, 0xffffff, 0.26);
    g.beginPath().moveTo(x + 12, y + 10).lineTo(x + w - 12, y + 10).strokePath();
  }

  private drawKitchen(theme: ArenaTheme) {
    const g = this.graphics(-20);
    this.drawCounter(g, 76, 76, 248, 54, 0xd95f3f, theme.wallTrim);
    this.drawCounter(g, 374, 76, 214, 54, 0x4aa3df, theme.wallTrim);
    this.drawCounter(g, 806, 76, 350, 54, 0xd95f3f, theme.wallTrim);
    this.drawCounter(g, 70, 574, 220, 50, 0x7d5238, theme.wallTrim);
    this.drawCounter(g, 988, 574, 220, 50, 0x7d5238, theme.wallTrim);

    g.fillStyle(theme.accent2, 0.3).fillRoundedRect(498, 322, 284, 76, 14);
    g.lineStyle(3, theme.accent2, 0.55).strokeRoundedRect(498, 322, 284, 76, 14);
    this.drawUtensils(g, theme, 120, 88);
    this.drawUtensils(g, theme, 862, 88);
  }

  private drawMarket(theme: ArenaTheme) {
    const g = this.graphics(-20);
    for (let i = 0; i < 4; i += 1) {
      this.drawCounter(g, 96 + i * 284, 82, 188, 52, 0x4e8f67, theme.wallTrim);
      this.drawCounter(g, 96 + i * 284, 584, 188, 52, 0x4e8f67, theme.wallTrim);
    }
    g.fillStyle(theme.accent, 0.95);
    for (let i = 0; i < 9; i += 1) {
      g.fillCircle(132 + i * 36, 108, 8);
      g.fillCircle(698 + i * 36, 610, 8);
    }
    g.fillStyle(theme.accent2, 0.85);
    for (let i = 0; i < 8; i += 1) {
      g.fillRoundedRect(466 + i * 40, 92, 22, 24, 5);
      g.fillRoundedRect(108 + i * 40, 596, 22, 24, 5);
    }
    g.lineStyle(4, theme.wallTrim, 0.35);
    g.strokeRoundedRect(84, 188, 236, 344, 16);
    g.strokeRoundedRect(960, 188, 236, 344, 16);
  }

  private drawFestival(theme: ArenaTheme) {
    const g = this.graphics(-20);
    this.drawCounter(g, 78, 82, 230, 62, 0xff4757, 0xffd93d);
    this.drawCounter(g, 372, 82, 230, 62, 0x9b59ff, 0xffd93d);
    this.drawCounter(g, 678, 82, 230, 62, 0x00a8ff, 0xffd93d);
    this.drawCounter(g, 972, 82, 230, 62, 0xffa502, 0xffd93d);
    this.drawCounter(g, 76, 584, 260, 54, 0x121226, 0xffd93d);
    this.drawCounter(g, 944, 584, 260, 54, 0x121226, 0xffd93d);

    g.lineStyle(3, theme.accent2, 0.45);
    g.beginPath().moveTo(44, 174).lineTo(GAME_WIDTH - 44, 174).strokePath();
    g.beginPath().moveTo(44, 548).lineTo(GAME_WIDTH - 44, 548).strokePath();

    for (let x = 96; x <= GAME_WIDTH - 96; x += 104) {
      g.fillStyle(x % 208 === 0 ? theme.accent : theme.accent2, 0.9);
      g.fillCircle(x, 174, 12);
      g.fillCircle(x + 50, 548, 10);
      g.fillStyle(0xffffff, 0.26).fillCircle(x - 3, 170, 4);
    }
  }

  private drawFinalKitchen(theme: ArenaTheme) {
    const g = this.graphics(-20);
    this.drawCounter(g, 72, 72, 300, 58, 0x32284f, theme.wallTrim);
    this.drawCounter(g, 908, 72, 300, 58, 0x32284f, theme.wallTrim);
    this.drawCounter(g, 72, 584, 300, 58, 0x32284f, theme.wallTrim);
    this.drawCounter(g, 908, 584, 300, 58, 0x32284f, theme.wallTrim);

    g.lineStyle(5, theme.accent, 0.35).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 142);
    g.lineStyle(3, theme.accent2, 0.42).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 94);
    g.fillStyle(theme.wallTrim, 0.16).fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 54);
    g.lineStyle(3, theme.wallTrim, 0.4);
    g.beginPath().moveTo(GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2).lineTo(GAME_WIDTH / 2 + 180, GAME_HEIGHT / 2).strokePath();
    g.beginPath().moveTo(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 180).lineTo(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 180).strokePath();
  }

  private drawUtensils(g: Phaser.GameObjects.Graphics, theme: ArenaTheme, x: number, y: number) {
    g.lineStyle(3, theme.wallTrim, 0.9);
    for (let i = 0; i < 4; i += 1) {
      const px = x + i * 34;
      g.beginPath().moveTo(px, y).lineTo(px, y + 30).strokePath();
      g.fillStyle(i % 2 === 0 ? theme.accent : theme.accent2, 0.85).fillCircle(px, y + 34, 7);
    }
  }

  private drawPlayAreaGuide(theme: ArenaTheme) {
    const g = this.graphics(-18);
    g.lineStyle(2, theme.wallTrim, 0.16);
    g.strokeRoundedRect(70, 146, GAME_WIDTH - 140, GAME_HEIGHT - 250, 22);
    g.fillStyle(0xffffff, this.worldId === 3 || this.worldId === 4 ? 0.04 : 0.12);
    g.fillRoundedRect(72, 148, GAME_WIDTH - 144, GAME_HEIGHT - 254, 22);
  }
}
