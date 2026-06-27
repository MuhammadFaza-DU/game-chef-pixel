import Phaser from 'phaser';
import type { PowerUp } from './PowerUpSystem';

export type Ingredient = '🍅' | '🧅' | '🍗' | '🌶️' | '🍳' | '🧀' | '🍌' | '🍦';

interface Recipe {
  needs: Ingredient[];
  result: PowerUp & { dish: string };
}

/** Resep masakan (sesuai tabel PRD). */
const RECIPES: Recipe[] = [
  {
    needs: ['🍗', '🌶️'],
    result: { id: 'ayam-geprek', name: 'Ayam Geprek', dish: 'Ayam Geprek', durationMs: 8000, damageMultiplier: 1.5 },
  },
  {
    needs: ['🍅', '🧅'],
    result: { id: 'sambal', name: 'Sambal', dish: 'Sambal', durationMs: 8000, damageMultiplier: 1, effect: 'aoe' },
  },
  {
    needs: ['🍳', '🧀'],
    result: { id: 'omelet', name: 'Omelet', dish: 'Omelet', durationMs: 1, damageMultiplier: 1, healOnApply: 40 },
  },
  {
    needs: ['🍌', '🍦'],
    result: { id: 'es-pisang', name: 'Es Pisang', dish: 'Es Pisang', durationMs: 8000, damageMultiplier: 1, effect: 'freeze' },
  },
];

const COSMIC: PowerUp & { dish: string } = {
  id: 'nasi-goreng-kosmik',
  name: 'NASI GORENG KOSMIK',
  dish: 'NASI GORENG KOSMIK',
  durationMs: 10000,
  damageMultiplier: 3,
  effect: 'ultra',
};

/** Inventory bahan + logika masak di Kompor Darurat. */
export default class CookingSystem extends Phaser.Events.EventEmitter {
  private inventory: Ingredient[] = [];
  // 4 slot: cukup untuk resep 2-bahan sekaligus membuka Nasi Goreng Kosmik (butuh 4 bahan berbeda).
  readonly maxSlots = 4;

  addIngredient(item: Ingredient): boolean {
    if (this.inventory.length >= this.maxSlots) return false;
    this.inventory.push(item);
    this.emit('change', [...this.inventory]);
    return true;
  }

  get slots() {
    return [...this.inventory];
  }

  /** Buang bahan terakhir dari inventory. Kembalikan item-nya agar bisa di-spawn di lantai. */
  dropLast(): Ingredient | null {
    if (this.inventory.length === 0) return null;
    const item = this.inventory.pop()!;
    this.emit('change', [...this.inventory]);
    return item;
  }

  /** Coba masak isi inventory. Mengembalikan power-up bila resep cocok, atau string alasan gagal. */
  cook(): (PowerUp & { dish: string }) | null | string {
    if (this.inventory.length < 2) return 'BUTUH MIN. 2 BAHAN!';

    // Cek Nasi Goreng Kosmik: punya >=4 bahan berbeda
    if (new Set(this.inventory).size >= 4) {
      this.inventory = [];
      this.emit('change', []);
      return COSMIC;
    }

    const match = RECIPES.find((r) => r.needs.every((n) => this.inventory.includes(n)));
    if (!match) return 'BAHAN TIDAK COCOK RESEP!';

    // konsumsi bahan yang dipakai
    for (const n of match.needs) {
      this.inventory.splice(this.inventory.indexOf(n), 1);
    }
    this.emit('change', [...this.inventory]);
    return match.result;
  }
}
