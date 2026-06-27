/**
 * Konfigurasi spritesheet LuizMelo untuk semua karakter & musuh.
 * Frame size & jumlah frame dihitung dari dimensi PNG aktual.
 *
 * ── INSTRUKSI SETUP ─────────────────────────────────────────────────────────
 *  File sudah tersedia di brawl-frontend/public/sprites/.
 *  Jika mengganti pack, sesuaikan frameWidth, frameHeight, dan frames.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type AnimKey = 'idle' | 'run' | 'attack1' | 'attack2' | 'hurt' | 'dead';

export interface SheetDef {
  file: string;
  frames: number;
  frameRate: number;
}

export interface SpriteDef {
  basePath: string;
  frameWidth: number;
  frameHeight: number;
  sheets: Partial<Record<AnimKey, SheetDef>>;
}

// ─── Karakter Pemain ──────────────────────────────────────────────────────────

export const CHARACTER_SPRITES: Record<string, SpriteDef> = {
  mimi: {
    basePath: 'sprites/characters/mimi', // Huntress — 150×150 per frame
    frameWidth: 150,
    frameHeight: 150,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 8, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 5, frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 5, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 3, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 8, frameRate: 8  },
    },
  },
  bobo: {
    basePath: 'sprites/characters/bobo', // Martial Hero — 200×200 per frame
    frameWidth: 200,
    frameHeight: 200,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 8, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 6, frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 6, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 6, frameRate: 8  },
    },
  },
  lala: {
    basePath: 'sprites/characters/lala', // Evil Wizard — 150×150 per frame
    frameWidth: 150,
    frameHeight: 150,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 8, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 }, // Move.png di-copy sebagai Run.png
      attack1: { file: 'Attack1.png',  frames: 8, frameRate: 12 }, // Attack.png di-copy sebagai Attack1.png
      // attack2 sengaja tidak ada — Player.ts graceful skip ke idle
      hurt:    { file: 'Take_Hit.png', frames: 4, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 5, frameRate: 8  },
    },
  },
};

// ─── Boss ─────────────────────────────────────────────────────────────────────

export const BOSS_SPRITES: Record<string, SpriteDef> = {
  'chef-robot-micro': {
    basePath: 'sprites/bosses/chef-robot-micro', // Hero Knight — 180×180
    frameWidth: 180,
    frameHeight: 180,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 11, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8,  frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 7,  frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 7,  frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4,  frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 11, frameRate: 8  },
    },
  },
  'kasir-mutan': {
    basePath: 'sprites/bosses/kasir-mutan', // Hero Knight 2 — 140×140
    frameWidth: 140,
    frameHeight: 140,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 11, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8,  frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 6,  frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4,  frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 9,  frameRate: 8  },
    },
  },
  'duo-mc-besar': {
    basePath: 'sprites/bosses/duo-mc-besar', // Medieval King — 155×155
    frameWidth: 155,
    frameHeight: 155,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 6,  frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8,  frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 6,  frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 6,  frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4,  frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 11, frameRate: 8  },
    },
  },
  'duo-mc-kecil': {
    basePath: 'sprites/bosses/duo-mc-kecil', // Fantasy Warrior — 162×162
    frameWidth: 162,
    frameHeight: 162,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 10, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8,  frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 7,  frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 7,  frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 3,  frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 7,  frameRate: 8  },
    },
  },
  'chef-besar': {
    basePath: 'sprites/bosses/chef-besar', // Evil Wizard 2 — 250×250
    frameWidth: 250,
    frameHeight: 250,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 8, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 },
      attack1: { file: 'Attack1.png',  frames: 8, frameRate: 12 },
      attack2: { file: 'Attack2.png',  frames: 8, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 3, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 7, frameRate: 8  },
    },
  },
};

// ─── Musuh ────────────────────────────────────────────────────────────────────

export const ENEMY_SPRITES: Record<string, SpriteDef> = {
  'koki-biasa': {
    basePath: 'sprites/enemies/koki-biasa', // Goblin — 150×150
    frameWidth: 150,
    frameHeight: 150,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 4, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 },
      attack1: { file: 'Attack.png',   frames: 8, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 4, frameRate: 8  },
    },
  },
  'koki-besar': {
    basePath: 'sprites/enemies/koki-besar', // Skeleton — 150×150
    frameWidth: 150,
    frameHeight: 150,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 4, frameRate: 8  },
      run:     { file: 'Walk.png',     frames: 4, frameRate: 8  },
      attack1: { file: 'Attack.png',   frames: 8, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 4, frameRate: 8  },
    },
  },
  'koki-bom': {
    basePath: 'sprites/enemies/koki-bom', // Mushroom — 150×150
    frameWidth: 150,
    frameHeight: 150,
    sheets: {
      idle:    { file: 'Idle.png',     frames: 4, frameRate: 8  },
      run:     { file: 'Run.png',      frames: 8, frameRate: 10 },
      attack1: { file: 'Attack.png',   frames: 8, frameRate: 12 },
      hurt:    { file: 'Take_Hit.png', frames: 4, frameRate: 10 },
      dead:    { file: 'Death.png',    frames: 4, frameRate: 8  },
    },
  },
};
