import * as migration_20260612_024004_initial from './20260612_024004_initial';

export const migrations = [
  {
    up: migration_20260612_024004_initial.up,
    down: migration_20260612_024004_initial.down,
    name: '20260612_024004_initial'
  },
];
