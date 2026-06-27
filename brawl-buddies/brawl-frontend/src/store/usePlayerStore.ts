import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterId } from '../game/entities/characters';

export const LAST_WORLD = 4;

interface PlayerState {
  username: string;
  selectedCharacter: CharacterId;
  unlocked: CharacterId[];
  highScore: number;
  currentWorld: number;
  completedWorlds: number[];
  savedWorld: number | null;
  setUsername: (name: string) => void;
  selectCharacter: (id: CharacterId) => void;
  submitScore: (score: number) => void;
  completeWorld: (world: number) => void;
  setSavedWorld: (world: number | null) => void;
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
      setSavedWorld: (savedWorld) => set({ savedWorld }),
    }),
    { name: 'brawl-player' },
  ),
);
