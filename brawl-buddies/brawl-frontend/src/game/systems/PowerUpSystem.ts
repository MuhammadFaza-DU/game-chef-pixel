import Phaser from 'phaser';

export interface PowerUp {
  id: string;
  name: string;
  durationMs: number;
  damageMultiplier: number;
  healOnApply?: number;
  effect?: 'aoe' | 'freeze' | 'ultra';
}

/** Mengelola power-up aktif & sisa durasinya (hasil masak). */
export default class PowerUpSystem extends Phaser.Events.EventEmitter {
  private active = new Map<string, { def: PowerUp; remaining: number }>();

  apply(p: PowerUp) {
    this.active.set(p.id, { def: p, remaining: p.durationMs });
    this.emit('change', this.list());
  }

  tick(delta: number) {
    if (this.active.size === 0) return;
    for (const [id, entry] of this.active) {
      entry.remaining -= delta;
      if (entry.remaining <= 0) this.active.delete(id);
    }
    this.emit('change', this.list());
  }

  /** Total pengali damage dari semua power-up aktif. */
  get damageMultiplier() {
    let m = 1;
    for (const { def } of this.active.values()) m *= def.damageMultiplier;
    return m;
  }

  has(effect: PowerUp['effect']) {
    for (const { def } of this.active.values()) if (def.effect === effect) return true;
    return false;
  }

  list() {
    return [...this.active.values()].map((e) => ({ ...e.def, remaining: e.remaining }));
  }
}
