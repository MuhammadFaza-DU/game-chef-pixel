import type { WorldConfig } from './types';

/** World 4: ISTANA MANGKUK JAHAT — final world. */
const World4: WorldConfig = {
  id: 4,
  name: 'Istana Mangkuk Jahat',
  bgColor: '#1a1a2e',
  bgLayers: ['bg-w4-back', 'bg-w4-mid', 'bg-w4-front'],
  enemyTheme: 'Elite Guard berarmor loyang',
  gimmick: 'Gravitasi berubah-ubah, musuh dari langit-langit',
  bossKey: 'ChefBesarMangkukJahat',
  waves: [
    { enemies: ['besar', 'besar', 'bom', 'biasa'] },
    { enemies: ['besar', 'besar', 'besar', 'bom', 'bom'] },
    { enemies: ['besar', 'besar', 'besar', 'bom', 'bom', 'biasa', 'biasa'] },
  ],
};

export default World4;
