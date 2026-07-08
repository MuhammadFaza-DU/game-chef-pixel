import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterId } from '../game/entities/characters';

export const LAST_WORLD = 4;

function normalizeSavedWorld(world: number | null) {
  return world && world >= 1 && world <= LAST_WORLD ? world : null;
}

interface PlayerState {
  username: string;
  selectedCharacter: CharacterId;
  unlocked: CharacterId[];
  highScore: number;
  currentWorld: number;
  completedWorlds: number[];
  savedWorld: number | null;
  hasSavedRun: () => boolean;
  getStartWorld: () => number;
  setUsername: (name: string) => void;
  selectCharacter: (id: CharacterId) => void;
  submitScore: (score: number) => void;
  completeWorld: (world: number) => void;
  setSavedWorld: (world: number | null) => void;
  clearSavedRun: () => void;
}

/** Profil pemain — persist ke localStorage (Guest Mode sesuai PRD). */
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      username: 'Chef Tamu',
      selectedCharacter: 'mimi',
      unlocked: ['mimi', 'bobo', 'lala'],
      highScore: 0,
      currentWorld: 1,
      completedWorlds: [],
      savedWorld: null,
      hasSavedRun: () => normalizeSavedWorld(get().savedWorld) !== null,
      getStartWorld: () => {
        return normalizeSavedWorld(get().savedWorld) ?? 1;
      },
      setUsername: (username) => set({ username }),
      selectCharacter: (selectedCharacter) => set({ selectedCharacter }),
      submitScore: (score) => set({ highScore: Math.max(get().highScore, score) }),
      completeWorld: (world) => set((state) => {
        const completedWorlds = state.completedWorlds.includes(world)
          ? state.completedWorlds
          : [...state.completedWorlds, world].sort((a, b) => a - b);
        const nextWorld = Math.min(world + 1, LAST_WORLD);

        return {
          completedWorlds,
          currentWorld: Math.max(state.currentWorld, nextWorld),
        };
      }),
      setSavedWorld: (savedWorld) => set({ savedWorld: normalizeSavedWorld(savedWorld) }),
      clearSavedRun: () => set({ savedWorld: null, currentWorld: 1 }),
    }),
    { name: 'brawl-player' },
  ),
);
