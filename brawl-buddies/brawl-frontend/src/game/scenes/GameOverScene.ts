import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { EventBus } from '../EventBus';
import { setTargetWorld } from '../targetWorld';
import { usePlayerStore } from '../../store/usePlayerStore';

interface GameOverData {
  score: number;
  world: number;
  win?: boolean;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: GameOverData) {
    const win = !!data.win;
    setTargetWorld(1);
    usePlayerStore.getState().clearSavedRun();

    this.drawKitchenBackdrop(win);

    const panelW = 620;
    const panelH = 380;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const cx = GAME_WIDTH / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x2c1621, 0.42);
    panel.fillRoundedRect(panelX + 10, panelY + 12, panelW, panelH, 22);
    panel.fillStyle(win ? 0xfff3c4 : 0x241421, 1);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 22);
    panel.lineStyle(7, 0x2c1621, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 22);
    panel.lineStyle(4, win ? 0xffcf5a : 0xff4c55, 1);
    panel.strokeRoundedRect(panelX + 14, panelY + 14, panelW - 28, panelH - 28, 16);

    this.add
      .text(cx, panelY + 74, win ? 'ORDER SELESAI!' : 'DAPUR KACAU!', {
        fontSize: '58px',
        fontStyle: 'bold',
        color: win ? '#2c1621' : '#fff9e8',
        stroke: win ? '#ffcf5a' : '#c4203d',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, panelY + 145, win ? 'Semua rival sudah tumbang.' : 'Chef tumbang. Dapur reset ke World 1.', {
        fontSize: '25px',
        color: win ? '#6d3b2d' : '#ffcf5a',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, panelY + 195, `Skor: ${data.score.toLocaleString('id-ID')}   /   World: ${data.world}`, {
        fontSize: '27px',
        fontStyle: 'bold',
        color: win ? '#c4203d' : '#fff9e8',
      })
      .setOrigin(0.5);

    this.makeBtn(cx, panelY + 274, 'MAIN LAGI', 0xffcf5a, 0xffe67a, 0x2c1621, () => {
      setTargetWorld(1);
      usePlayerStore.getState().clearSavedRun();
      this.scene.start('CharacterSelectScene', { world: 1 });
    });

    this.makeBtn(cx, panelY + 334, 'MENU UTAMA', 0x4c2d50, 0x6a3a70, 0xfff9e8, () => {
      setTargetWorld(1);
      usePlayerStore.getState().clearSavedRun();
      EventBus.emit('game:goto-menu');
    });
  }

  private drawKitchenBackdrop(win: boolean) {
    const g = this.add.graphics();
    g.fillGradientStyle(win ? 0x22402a : 0x2b1231, win ? 0x22402a : 0x2b1231, 0x17111f, 0x17111f, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.lineStyle(1, 0xffffff, 0.07);
    for (let x = 0; x < GAME_WIDTH; x += 54) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, GAME_HEIGHT * 0.48);
      g.strokePath();
    }
    for (let y = 0; y < GAME_HEIGHT * 0.48; y += 34) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(GAME_WIDTH, y);
      g.strokePath();
    }
    g.fillStyle(0x3f2431, 1);
    g.fillRect(0, GAME_HEIGHT * 0.48, GAME_WIDTH, GAME_HEIGHT * 0.52);
    g.fillStyle(win ? 0xffcf5a : 0xff4c55, 0.18);
    g.fillCircle(180, 150, 160);
    g.fillCircle(GAME_WIDTH - 150, GAME_HEIGHT - 120, 190);
  }

  private makeBtn(
    x: number,
    y: number,
    label: string,
    color: number,
    hoverColor: number,
    textColor: number,
    onClick: () => void,
  ) {
    const W = 320;
    const H = 48;
    const bg = this.add.graphics();

    const draw = (c: number, lift = 0) => {
      bg.clear();
      bg.fillStyle(0x2c1621, 1);
      bg.fillRoundedRect(x - W / 2 + 5, y - H / 2 + 7 - lift, W, H, 11);
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(x - W / 2, y - H / 2 - lift, W, H, 11);
      bg.lineStyle(4, 0x2c1621, 1);
      bg.strokeRoundedRect(x - W / 2, y - H / 2 - lift, W, H, 11);
    };
    draw(color);

    const text = this.add
      .text(x, y, label, { fontSize: '22px', fontStyle: 'bold', color: Phaser.Display.Color.IntegerToColor(textColor).rgba })
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .zone(x, y, W, H)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        draw(hoverColor, 3);
        text.setY(y - 3);
      })
      .on('pointerout', () => {
        draw(color);
        text.setY(y);
      })
      .on('pointerdown', onClick);
  }
}
