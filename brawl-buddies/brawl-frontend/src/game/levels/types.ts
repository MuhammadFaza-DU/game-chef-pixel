export type EnemyKind = 'biasa' | 'besar' | 'bom';

export interface Wave {
  enemies: EnemyKind[];
}

export interface WorldConfig {
  id: number;
  name: string;
  bgColor: string;
  bgLayers?: [string, string, string];
  enemyTheme: string;
  gimmick: string;
  bossKey: 'ChefRobotMicro' | 'KasirMutan' | 'DuoMCMakan' | 'ChefBesarMangkukJahat';
  waves: Wave[];
}
