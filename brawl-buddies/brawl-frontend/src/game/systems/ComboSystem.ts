import Phaser from 'phaser';

/**
 * Melacak combo & multiplier. Multiplier naik x1→x2→x3→FRENZY x5
 * berdasarkan jumlah hit beruntun dalam window waktu.
 */
export default class ComboSystem extends Phaser.Events.EventEmitter {
  private hits = 0;
  private multiplier = 1;
  private score = 0;
  private resetTimer = 0;
  private readonly windowMs = 1500;

  /** Panggil tiap kali serangan mengenai musuh. */
  registerHit(basePoints = 100) {
    this.hits += 1;
    this.resetTimer = this.windowMs;
    this.multiplier = this.computeMultiplier(this.hits);
    this.score += basePoints * this.multiplier;
    this.emit('change', this.snapshot());
  }

  tick(delta: number) {
    if (this.hits === 0) return;
    this.resetTimer -= delta;
    if (this.resetTimer <= 0) this.reset();
  }

  private computeMultiplier(hits: number): number {
    if (hits >= 15) return 5; // FRENZY
    if (hits >= 9) return 3;
    if (hits >= 4) return 2;
    return 1;
  }

  private reset() {
    if (this.hits > 0) {
      this.hits = 0;
      this.multiplier = 1;
      this.emit('change', this.snapshot());
    }
  }

  get isFrenzy() {
    return this.multiplier >= 5;
  }

  snapshot() {
    return { hits: this.hits, multiplier: this.multiplier, score: this.score };
  }
}
