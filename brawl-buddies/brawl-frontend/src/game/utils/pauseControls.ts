import Phaser from 'phaser';
import { EventBus } from '../EventBus';

/**
 * Hubungkan scene gameplay ke event pause/resume global yang dipancarkan HUD React.
 * `scene.pause()` menghentikan update + physics (benar-benar freeze), bukan sekadar overlay.
 * Listener dibersihkan otomatis saat scene shutdown agar tidak menumpuk antar-transisi.
 */
export function registerPause(scene: Phaser.Scene) {
  const getScenePlugin = () => {
    const plugin = scene.scene;
    return plugin?.settings ? plugin : null;
  };

  const onPause = () => {
    const plugin = getScenePlugin();
    if (plugin?.isActive()) plugin.pause();
  };
  const onResume = () => {
    const plugin = getScenePlugin();
    if (plugin?.isPaused()) plugin.resume();
  };
  const onGotoCharSelect = (data?: { world?: number }) => {
    const plugin = getScenePlugin();
    if (plugin?.isPaused()) plugin.resume();
    plugin?.start('CharacterSelectScene', data);
  };

  EventBus.on('game:pause', onPause);
  EventBus.on('game:resume', onResume);
  EventBus.on('game:goto-char-select', onGotoCharSelect);

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    EventBus.off('game:pause', onPause);
    EventBus.off('game:resume', onResume);
    EventBus.off('game:goto-char-select', onGotoCharSelect);
  });
}
