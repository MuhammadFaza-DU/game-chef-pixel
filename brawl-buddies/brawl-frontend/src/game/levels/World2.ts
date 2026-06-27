import type { WorldConfig } from './types';

/** World 2: PASAR SWALAYAN KACAU. */
const World2: WorldConfig = {
  id: 2,
  name: 'Pasar Swalayan Kacau',
  bgColor: '#ffeaa7',
  bgLayers: ['bg-w2-back', 'bg-w2-mid', 'bg-w2-front'],
  enemyTheme: 'Sayuran & buah yang diprogram jahat',
  gimmick: 'Keranjang belanja bisa dikendarai',
  bossKey: 'KasirMutan',
  waves: [
    { enemies: ['biasa', 'biasa', 'biasa'] },
    { enemies: ['besar', 'bom', 'biasa'] },
    { enemies: ['besar', 'besar', 'bom', 'biasa'] },
  ],
};

export default World2;
