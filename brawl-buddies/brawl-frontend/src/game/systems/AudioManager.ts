import Phaser from 'phaser';

const SFX_KEYS = [
  'hit-light', 'hit-heavy', 'hit-special',
  'enemy-die', 'pickup', 'powerup', 'hurt',
  'gameover', 'wave-start', 'combo', 'boss-appear', 'cook',
  'explosion', 'world-clear', 'menu-click',
] as const;

const BGM_KEYS = ['bgm-world-1', 'bgm-world-2', 'bgm-world-3', 'bgm-world-4', 'bgm-boss', 'bgm-menu'] as const;

export type SfxKey = typeof SFX_KEYS[number];
export type BgmKey = typeof BGM_KEYS[number];

/**
 * Singleton audio manager — dibagi lintas scene melalui referensi static.
 * Panggil AudioManager.init(scene) di setiap create() scene.
 */
export default class AudioManager {
  private static sm: Phaser.Sound.BaseSoundManager | null = null;
  private static bgmSound: Phaser.Sound.BaseSound | null = null;
  private static _muted = false;

  static init(scene: Phaser.Scene) {
    this.sm = scene.sound;
    this._muted = localStorage.getItem('brawl-muted') === '1';
    (this.sm as Phaser.Sound.WebAudioSoundManager).mute = this._muted;
  }

  static sfx(key: SfxKey, volume = 0.7) {
    if (!this.sm) return;
    try {
      if (this.sm.game.cache.audio.has(key)) this.sm.play(key, { volume });
    } catch {
      // audio tidak tersedia, lewati
    }
  }

  static playBgm(key: BgmKey, volume = 0.4) {
    if (!this.sm) return;
    this.stopBgm();
    try {
      if (!this.sm.game.cache.audio.has(key)) return;
      this.bgmSound = this.sm.add(key, { loop: true, volume });
      this.bgmSound.play();
    } catch {
      // audio tidak tersedia, lewati
    }
  }

  static stopBgm() {
    try { this.bgmSound?.stop(); } catch { /* empty */ }
    this.bgmSound = null;
  }

  static toggle(): boolean {
    this._muted = !this._muted;
    localStorage.setItem('brawl-muted', this._muted ? '1' : '0');
    if (this.sm) (this.sm as Phaser.Sound.WebAudioSoundManager).mute = this._muted;
    return this._muted;
  }

  static get muted() {
    return this._muted;
  }

  static get sfxKeys() { return SFX_KEYS; }
  static get bgmKeys() { return BGM_KEYS; }
}
