import * as migration_20260612_024004_initial from './20260612_024004_initial';
import * as migration_20260612_085939_blocks_round2 from './20260612_085939_blocks_round2';
import * as migration_20260612_094116_two_column_quotes_centered from './20260612_094116_two_column_quotes_centered';

export const migrations = [
  {
    up: migration_20260612_024004_initial.up,
    down: migration_20260612_024004_initial.down,
    name: '20260612_024004_initial',
  },
  {
    up: migration_20260612_085939_blocks_round2.up,
    down: migration_20260612_085939_blocks_round2.down,
    name: '20260612_085939_blocks_round2',
  },
  {
    up: migration_20260612_094116_two_column_quotes_centered.up,
    down: migration_20260612_094116_two_column_quotes_centered.down,
    name: '20260612_094116_two_column_quotes_centered'
  },
];
