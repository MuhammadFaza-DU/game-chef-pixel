import { useAchievementStore } from '../store/useAchievementStore';

const PROGRESS_KEY = 'brawl-achievement-progress';

// 5 masakan = 4 resep + Nasi Goreng Kosmik.
const ALL_DISHES = ['ayam-geprek', 'sambal', 'omelet', 'es-pisang', 'nasi-goreng-kosmik'];

interface Progress {
  cooked: string[];
  cosmicCount: number;
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { cooked: [], cosmicCount: 0 };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      cooked: Array.isArray(parsed.cooked) ? parsed.cooked : [],
      cosmicCount: typeof parsed.cosmicCount === 'number' ? parsed.cosmicCount : 0,
    };
  } catch {
    return { cooked: [], cosmicCount: 0 };
  }
}

function saveProgress(p: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

/** Progress ratio masakan (0..1) untuk UI, dipakai juga oleh halaman profil. */
export function getDishProgress() {
  const p = loadProgress();
  return ALL_DISHES.filter((d) => p.cooked.includes(d)).length / ALL_DISHES.length;
}

// State per-run / per-level (tidak dipersist).
let healUsedThisLevel = false;
let worldStartTime = 0;

/** Mulai hitung durasi level baru (dipanggil di GameScene.create). */
export function startLevel(world: number) {
  void world;
  worldStartTime = Date.now();
  healUsedThisLevel = false;
}

/** Tandai pemain memakai heal (resep omelet). */
export function markHealUsed() {
  healUsedThisLevel = true;
}

/** Dipanggil setiap kali berhasil masak masakan. */
export function trackCookedDish(dishName: string) {
  const p = loadProgress();
  if (!p.cooked.includes(dishName)) {
    p.cooked = [...p.cooked, dishName];
    saveProgress(p);
  }
  if (dishName === 'nasi-goreng-kosmik') {
    p.cosmicCount += 1;
    saveProgress(p);
  }

  const store = useAchievementStore.getState();
  if (ALL_DISHES.every((d) => p.cooked.includes(d))) store.unlock('masterchef');
  if (p.cosmicCount >= 5) store.unlock('kosmik');
}

/** Dipanggil saat boss dikalahkan (world clear). */
export function trackBossDefeat(world: number) {
  const elapsedMs = Date.now() - worldStartTime;
  const store = useAchievementStore.getState();
  store.unlock('solo-meal');
  if (world === 1 && elapsedMs < 5 * 60 * 1000) store.unlock('sonic');
  if (!healUsedThisLevel) store.unlock('no-pain');
}