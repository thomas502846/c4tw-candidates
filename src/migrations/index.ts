import * as migration_20260612_024004_initial from './20260612_024004_initial';
import * as migration_20260612_085939_blocks_round2 from './20260612_085939_blocks_round2';
import * as migration_20260612_094116_two_column_quotes_centered from './20260612_094116_two_column_quotes_centered';
import * as migration_20260613_150252_round5_photostrip_eyebrows from './20260613_150252_round5_photostrip_eyebrows';
import * as migration_20260614_014135_hero_slide_text from './20260614_014135_hero_slide_text';
import * as migration_20260614_081821_content_images_collage from './20260614_081821_content_images_collage';
import * as migration_20260618_042153_pageheader_focal from './20260618_042153_pageheader_focal';
import * as migration_20260618_085600_framepos_per_device from './20260618_085600_framepos_per_device';
import * as migration_20260618_122554_framepos_all_images from './20260618_122554_framepos_all_images';

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
    name: '20260612_094116_two_column_quotes_centered',
  },
  {
    up: migration_20260613_150252_round5_photostrip_eyebrows.up,
    down: migration_20260613_150252_round5_photostrip_eyebrows.down,
    name: '20260613_150252_round5_photostrip_eyebrows',
  },
  {
    up: migration_20260614_014135_hero_slide_text.up,
    down: migration_20260614_014135_hero_slide_text.down,
    name: '20260614_014135_hero_slide_text',
  },
  {
    up: migration_20260614_081821_content_images_collage.up,
    down: migration_20260614_081821_content_images_collage.down,
    name: '20260614_081821_content_images_collage',
  },
  {
    up: migration_20260618_042153_pageheader_focal.up,
    down: migration_20260618_042153_pageheader_focal.down,
    name: '20260618_042153_pageheader_focal',
  },
  {
    up: migration_20260618_085600_framepos_per_device.up,
    down: migration_20260618_085600_framepos_per_device.down,
    name: '20260618_085600_framepos_per_device',
  },
  {
    up: migration_20260618_122554_framepos_all_images.up,
    down: migration_20260618_122554_framepos_all_images.down,
    name: '20260618_122554_framepos_all_images'
  },
];
