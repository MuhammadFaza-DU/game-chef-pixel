import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

const SPEEDS = [0.05, 0.15, 0.3] as const;
const SCALE  = 3;

export class ParallaxBackground {
  private layers: Phaser.GameObjects.TileSprite[] = [];

  constructor(
    scene: Phaser.Scene,
    keys: [string, string, string],
    alpha = 1,
  ) {
    keys.forEach((key, i) => {
      if (!scene.textures.exists(key)) return;
      const tile = scene.add
        .tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
        .setOrigin(0, 0)
        .setTileScale(SCALE, SCALE)
        .setDepth(-10 + i)
        .setAlpha(alpha);
      this.layers.push(tile);
    });
  }

  update(playerX: number) {
    this.layers.forEach((layer, i) => {
      layer.tilePositionX = playerX * SPEEDS[i];
    });
  }

  destroy() {
    this.layers.forEach(l => l.destroy());
    this.layers = [];
  }
}
