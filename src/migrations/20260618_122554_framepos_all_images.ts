import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_content_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_awards_items" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_quote" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_two_column_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_numbered_features_items" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_ta_cta_cards" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_video_block" ADD COLUMN "poster_frame_pos" jsonb;
  ALTER TABLE "pages_blocks_mission_circles" ADD COLUMN "background_image_frame_pos" jsonb;
  ALTER TABLE "pages_blocks_infographic_photos" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_tabs_block_tabs" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN "image_frame_pos" jsonb;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN "space_image_frame_pos" jsonb;
  ALTER TABLE "pages_blocks_photo_strip_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_content_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_awards_items" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_two_column_images" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_numbered_features_items" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_ta_cta_cards" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_video_block" ADD COLUMN "poster_frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_mission_circles" ADD COLUMN "background_image_frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_infographic_photos" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN "image_frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN "space_image_frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_photo_strip_images" ADD COLUMN "frame_pos" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_images" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_content_images" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_awards_items" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_quote" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_two_column_images" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_numbered_features_items" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_ta_cta_cards" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_video_block" DROP COLUMN "poster_frame_pos";
  ALTER TABLE "pages_blocks_mission_circles" DROP COLUMN "background_image_frame_pos";
  ALTER TABLE "pages_blocks_infographic_photos" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_tabs_block_tabs" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_map_locations" DROP COLUMN "image_frame_pos";
  ALTER TABLE "pages_blocks_map_locations" DROP COLUMN "space_image_frame_pos";
  ALTER TABLE "pages_blocks_photo_strip_images" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_hero_images" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_content_images" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_awards_items" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_quote" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_two_column_images" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_numbered_features_items" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_ta_cta_cards" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_video_block" DROP COLUMN "poster_frame_pos";
  ALTER TABLE "_pages_v_blocks_mission_circles" DROP COLUMN "background_image_frame_pos";
  ALTER TABLE "_pages_v_blocks_infographic_photos" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_map_locations" DROP COLUMN "image_frame_pos";
  ALTER TABLE "_pages_v_blocks_map_locations" DROP COLUMN "space_image_frame_pos";
  ALTER TABLE "_pages_v_blocks_photo_strip_images" DROP COLUMN "frame_pos";`)
}
