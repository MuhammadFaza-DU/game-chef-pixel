import World1 from './World1';
import World2 from './World2';
import World3 from './World3';
import World4 from './World4';
import type { WorldConfig } from './types';

export const WORLDS: Record<number, WorldConfig> = {
  1: World1,
  2: World2,
  3: World3,
  4: World4,
};

export type { WorldConfig } from './types';
