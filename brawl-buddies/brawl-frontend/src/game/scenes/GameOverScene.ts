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

    this.cameras.main.setBackgroundColor(win ? '#0d1f0d' : '#0d0d1a');

    const panelW = 560;
    const panelH = 360;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const cx = GAME_WIDTH / 2;

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.72);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
    panel.lineStyle(3, win ? 0x2ed573 : 0xff4757, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 20);

    // Judul
    this.add
      .text(cx, panelY + 68, win ? '🏆 KAMU MENANG!' : '😵 GAME OVER!', {
        fontSize: '52px',
        fontStyle: 'bold',
        color: win ? '#2ed573' : '#ff4757',
        stroke: '#000000',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    // Skor
    this.add
      .text(cx, panelY + 148, `Skor Kamu: ${data.score.toLocaleString('id-ID')}`, {
        fontSize: '28px',
        color: '#ffd93d',
      })
      .setOrigin(0.5);

    // World
    this.add
      .text(cx, panelY + 192, `World Tercapai: World ${data.world}`, {
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Tombol utama — Main Lagi
    this.makeBtn(cx, panelY + 268, '🔁  MAIN LAGI', 0xff4757, 0xff6b81, () => {
      setTargetWorld(1);
      usePlayerStore.getState().setSavedWorld(null);
      this.scene.start('CharacterSelectScene', { world: 1 });
    });

    // Tombol sekunder — Menu Utama
    this.makeBtn(cx, panelY + 326, '🏠  MENU UTAMA', 0x2f3542, 0x485460, () => {
      setTargetWorld(1);
      usePlayerStore.getState().setSavedWorld(null);
      EventBus.emit('game:goto-menu');
    });
  }

  private makeBtn(
    x: number,
    y: number,
    label: string,
    color: number,
    hoverColor: number,
    onClick: () => void,
  ) {
    const W = 300;
    const H = 46;

    const bg = this.add.graphics();
    const draw = (c: number) => {
      bg.clear();
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(x - W / 2, y - H / 2, W, H, 10);
    };
    draw(color);

    this.add
      .text(x, y, label, { fontSize: '21px', fontStyle: 'bold', color: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .zone(x, y, W, H)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => draw(hoverColor))
      .on('pointerout', () => draw(color))
      .on('pointerdown', onClick);
  }
}
