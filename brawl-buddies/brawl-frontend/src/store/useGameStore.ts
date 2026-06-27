import { create } from 'zustand';
import type { HudState } from '../game/EventBus';

interface GameState extends HudState {
  paused: boolean;
  isMuted: boolean;
  setHud: (hud: HudState) => void;
  setPaused: (paused: boolean) => void;
  setMuted: (muted: boolean) => void;
}

const initialHud: HudState = {
  hp: 100,
  maxHp: 100,
  energy: 0,
  combo: { hits: 0, multiplier: 1, score: 0 },
  ingredients: [],
  world: 1,
  wave: 1,
  totalWaves: 3,
  powerups: [],
  isBoss: false,
};

/** State HUD global yang di-feed dari Phaser via EventBus. */
export const useGameStore = create<GameState>((set) => ({
  ...initialHud,
  paused: false,
  isMuted: localStorage.getItem('brawl-muted') === '1',
  setHud: (hud) => set(hud),
  setPaused: (paused) => set({ paused }),
  setMuted: (muted) => set({ isMuted: muted }),
}));
