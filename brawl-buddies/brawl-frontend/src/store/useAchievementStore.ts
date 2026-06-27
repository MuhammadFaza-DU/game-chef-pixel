import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  unlocked: boolean;
}

const SEED: Achievement[] = [
  { id: 'masterchef', name: 'Masterchef', emoji: '🏆', desc: 'Masak semua kombinasi masakan', unlocked: false },
  { id: 'no-pain', name: 'No Pain No Gain', emoji: '🥊', desc: 'Selesaikan level tanpa heal', unlocked: false },
  { id: 'kosmik', name: 'Nasi Goreng Kosmik', emoji: '🤣', desc: 'Aktifkan ultimate 5x', unlocked: false },
  { id: 'solo-meal', name: 'Solo Meal', emoji: '👨‍🍳', desc: 'Kalahkan boss sendirian', unlocked: false },
  { id: 'sonic', name: 'Sonic Delivery', emoji: '💨', desc: 'Selesaikan World 1 < 5 menit', unlocked: false },
];

interface AchievementState {
  achievements: Achievement[];
  unlock: (id: string) => void;
}

/** Achievement system (30+ target PRD) — persist lokal. */
export const useAchievementStore = create<AchievementState>()(
  persist(
    (set) => ({
      achievements: SEED,
      unlock: (id) =>
        set((s) => ({
          achievements: s.achievements.map((a) => (a.id === id ? { ...a, unlocked: true } : a)),
        })),
    }),
    { name: 'brawl-achievements' },
  ),
);
