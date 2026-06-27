/** Definisi data 3 starter character (sesuai PRD). */
export type CharacterId = 'mimi' | 'bobo' | 'lala';

export interface CharacterStats {
  speed: number; // 1-5
  power: number;
  defense: number;
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  emoji: string;
  title: string;
  color: number;
  stats: CharacterStats;
  /** kecepatan gerak px/detik diturunkan dari stat speed */
  moveSpeed: number;
  /** damage light attack diturunkan dari stat power */
  lightDamage: number;
  special: string;
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  mimi: {
    id: 'mimi',
    name: 'MIMI',
    emoji: '🍜',
    title: 'The Noodle Master\nAgile · combo panjang',
    color: 0xff4757,
    stats: { speed: 5, power: 2, defense: 2 },
    moveSpeed: 320,
    lightDamage: 8,
    special: 'Noodle Whirlwind',
  },
  bobo: {
    id: 'bobo',
    name: 'BOBO',
    emoji: '🥩',
    title: 'The Grill King\nTank · heavy hitter',
    color: 0xffa502,
    stats: { speed: 2, power: 5, defense: 4 },
    moveSpeed: 200,
    lightDamage: 16,
    special: 'MEGA BAKAR!',
  },
  lala: {
    id: 'lala',
    name: 'LALA',
    emoji: '🍰',
    title: 'The Pastry Puncher\nMid-range · projectile',
    color: 0xff6b9d,
    stats: { speed: 3, power: 3, defense: 3 },
    moveSpeed: 260,
    lightDamage: 11,
    special: 'Sweet Barrage',
  },
};
