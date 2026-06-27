import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/** Menu utama dalam-canvas. UI React HUD berada di layer terpisah. */
export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#9bd1ff');

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.3, 'BRAWL BUDDIES', {
        fontSize: '72px',
        fontStyle: 'bold',
        color: '#ff4757',
        stroke: '#1a1a2e',
        strokeThickness: 10,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.42, 'CHAOS KITCHEN', {
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#ffd93d',
        stroke: '#1a1a2e',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    const start = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, '▶ TEKAN UNTUK MULAI', {
        fontSize: '32px',
        color: '#1a1a2e',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: start,
      scale: 1.1,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    const go = () => this.scene.start('CharacterSelectScene');
    start.on('pointerdown', go);
    this.input.keyboard?.once('keydown', go);
  }
}
