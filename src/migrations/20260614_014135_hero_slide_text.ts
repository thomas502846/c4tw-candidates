import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_images" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_hero_images" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_hero_images" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_hero_images" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "cta_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "pages_blocks_hero_images" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_hero_images" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_hero_images" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_hero_images" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_hero_images" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_hero_images" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_hero_images" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_hero_images" DROP COLUMN "cta_url";`)
}
