/**
 * Jembatan kontrol sentuh -> Phaser. Daripada menduplikasi logika input,
 * kita pancarkan KeyboardEvent sintetis ke `window` (target default plugin
 * keyboard Phaser). Dengan begitu joystick & tombol layar memakai jalur yang
 * SAMA persis dengan keyboard fisik (termasuk JustDown utk attack, E utk masak).
 *
 * Phaser meng-index key berdasarkan `keyCode`, jadi kita override properti itu
 * pada event sintetis (browser modern men-set 0 secara default).
 */
const CODES: Record<string, number> = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,
  j: 74,
  k: 75,
  l: 76,
  e: 69,
  escape: 27,
};

function dispatch(type: 'keydown' | 'keyup', key: string) {
  const code = CODES[key.toLowerCase()] ?? 0;
  const ev = new KeyboardEvent(type, { key, bubbles: true });
  Object.defineProperty(ev, 'keyCode', { get: () => code });
  Object.defineProperty(ev, 'which', { get: () => code });
  window.dispatchEvent(ev);
}

export const pressKey = (key: string) => dispatch('keydown', key);
export const releaseKey = (key: string) => dispatch('keyup', key);

/** Tekan-lepas singkat untuk aksi sekali picu (attack/cook). */
export function tapKey(key: string) {
  pressKey(key);
  window.setTimeout(() => releaseKey(key), 90);
}

/** Tampilkan kontrol sentuh hanya di perangkat dengan pointer kasar (HP/tablet). */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || window.matchMedia?.('(pointer: coarse)').matches === true;
}
