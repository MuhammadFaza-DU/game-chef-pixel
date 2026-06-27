import { Howl } from 'howler';

/**
 * Wrapper Howler.js untuk BGM & SFX. File audio belum ada — pemanggilan
 * play() aman (no-op bila sprite belum dimuat). Daftarkan saat aset siap.
 */
class AudioManagerImpl {
  private sfx = new Map<string, Howl>();
  private bgm: Howl | null = null;
  private muted = false;

  registerSfx(key: string, src: string) {
    this.sfx.set(key, new Howl({ src: [src], volume: 0.7 }));
  }

  playSfx(key: string) {
    if (this.muted) return;
    this.sfx.get(key)?.play();
  }

  playBgm(src: string) {
    if (this.muted) return;
    this.bgm?.stop();
    this.bgm = new Howl({ src: [src], loop: true, volume: 0.4 });
    this.bgm.play();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.bgm?.pause();
    else this.bgm?.play();
    return this.muted;
  }
}

export const AudioManager = new AudioManagerImpl();
