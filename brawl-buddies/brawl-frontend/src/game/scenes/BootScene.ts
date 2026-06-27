import Phaser from 'phaser';

/** Scene pertama: set konfigurasi dasar lalu lanjut ke Preload. */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.scale.refresh();
    this.scene.start('PreloadScene');
  }
}
