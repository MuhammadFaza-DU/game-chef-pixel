import Phaser from 'phaser';

/**
 * Jembatan komunikasi Phaser ↔ React. Scene meng-emit event state,
 * komponen HUD React subscribe. Hindari referensi langsung antar layer.
 */
export const EventBus = new Phaser.Events.EventEmitter();

export type ActivePowerUp = {
  id: string;
  name: string;
  remaining: number;
  durationMs: number;
  effect?: string;
  damageMultiplier: number;
};

export type HudState = {
  hp: number;
  maxHp: number;
  energy: number;
  combo: { hits: number; multiplier: number; score: number };
  ingredients: string[];
  world: number;
  wave: number;
  totalWaves: number;
  powerups: ActivePowerUp[];
  isBoss: boolean;
};

