import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MainMenuScene from './scenes/MainMenuScene';
import TutorialScene from './scenes/TutorialScene';
import CharacterSelectScene from './scenes/CharacterSelectScene';
import GameScene from './scenes/GameScene';
import BossScene from './scenes/BossScene';
import GameOverScene from './scenes/GameOverScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

/** Konfigurasi Phaser global — resolusi, physics arcade, daftar scene. */
export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#9bd1ff',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 }, // beat 'em up top-down-ish: gerak X/Y bebas
        debug: false,
      },
    },
    scene: [
      BootScene,
      PreloadScene,
      MainMenuScene,
      TutorialScene,
      CharacterSelectScene,
      GameScene,
      BossScene,
      GameOverScene,
    ],
  };
}
