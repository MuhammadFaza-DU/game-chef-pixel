import type { WorldConfig } from './types';

/** World 3: FESTIVAL MAKANAN MALAM — neon, lampion. */
const World3: WorldConfig = {
  id: 3,
  name: 'Festival Makanan Malam',
  bgColor: '#2d1b4e',
  bgLayers: ['bg-w3-back', 'bg-w3-mid', 'bg-w3-front'],
  enemyTheme: 'Penjual makanan jahat dengan gerobak senjata',
  gimmick: 'Kompor di arena bisa diledakkan',
  bossKey: 'DuoMCMakan',
  waves: [
    { enemies: ['biasa', 'bom', 'bom'] },
    { enemies: ['besar', 'besar', 'biasa', 'bom'] },
    { enemies: ['besar', 'besar', 'bom', 'bom', 'biasa'] },
  ],
};

export default World3;
