import type { WorldConfig } from './types';

/** World 1: DAPUR LANGIT — tutorial + normal. */
const World1: WorldConfig = {
  id: 1,
  name: 'Dapur Langit',
  bgColor: '#9bd1ff',
  bgLayers: ['bg-w1-back', 'bg-w1-mid', 'bg-w1-front'],
  enemyTheme: 'Koki robot pemula',
  gimmick: 'Lantai bergerak di atas konveyor',
  bossKey: 'ChefRobotMicro',
  waves: [
    { enemies: ['biasa', 'biasa'] },
    { enemies: ['biasa', 'biasa', 'besar'] },
    { enemies: ['biasa', 'bom', 'besar'] },
  ],
};

export default World1;
