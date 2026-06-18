import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// 註：staging RDS 早期曾以 push 模式同步出多數欄位（enabled / gradient / steps_block 文字欄 /
// map_locations_sections 等），但未登記於 migration。本 migration 以「全冪等」改寫——
// 既有者 no-op、僅補真正缺的 `focal`——同時讓 schema snapshot 與實際 DB 對齊，後續 migrate:create 才乾淨。
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_page_header_gradient" AS ENUM('sage', 'lime'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_page_header_focal" AS ENUM('top', 'center', 'bottom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_page_header_gradient" AS ENUM('sage', 'lime'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_page_header_focal" AS ENUM('top', 'center', 'bottom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TYPE "public"."enum_pages_blocks_content_image_position" ADD VALUE IF NOT EXISTS 'belowCenter' BEFORE 'none';
  ALTER TYPE "public"."enum_pages_blocks_ta_cta_variant" ADD VALUE IF NOT EXISTS 'darkBand';
  ALTER TYPE "public"."enum_pages_blocks_icon_features_variant" ADD VALUE IF NOT EXISTS 'roles';
  ALTER TYPE "public"."enum__pages_v_blocks_content_image_position" ADD VALUE IF NOT EXISTS 'belowCenter' BEFORE 'none';
  ALTER TYPE "public"."enum__pages_v_blocks_ta_cta_variant" ADD VALUE IF NOT EXISTS 'darkBand';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_features_variant" ADD VALUE IF NOT EXISTS 'roles';
  CREATE TABLE IF NOT EXISTS "pages_blocks_map_locations_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_map_locations_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );

  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_page_header" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_page_header" ADD COLUMN IF NOT EXISTS "gradient" "enum_pages_blocks_page_header_gradient" DEFAULT 'sage';
  ALTER TABLE "pages_blocks_page_header" ADD COLUMN IF NOT EXISTS "focal" "enum_pages_blocks_page_header_focal" DEFAULT 'bottom';
  ALTER TABLE "pages_blocks_news_ticker" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_content" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_timeline" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_stats_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_awards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_article_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_logo_wall" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_quote" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_numbered_features" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_ta_cta" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_video_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_mission_circles" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_icon_features" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_icon_features" ADD COLUMN IF NOT EXISTS "heading" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN IF NOT EXISTS "heading" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN IF NOT EXISTS "body" varchar;
  ALTER TABLE "pages_blocks_steps_block" ADD COLUMN IF NOT EXISTS "footnote" varchar;
  ALTER TABLE "pages_blocks_infographic" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_tabs_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_pillar_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN IF NOT EXISTS "intro" varchar;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN IF NOT EXISTS "closing" varchar;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN IF NOT EXISTS "story_url" varchar;
  ALTER TABLE "pages_blocks_map_locations" ADD COLUMN IF NOT EXISTS "space_image_id" integer;
  ALTER TABLE "pages_blocks_photo_strip" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_page_header" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_page_header" ADD COLUMN IF NOT EXISTS "gradient" "enum__pages_v_blocks_page_header_gradient" DEFAULT 'sage';
  ALTER TABLE "_pages_v_blocks_page_header" ADD COLUMN IF NOT EXISTS "focal" "enum__pages_v_blocks_page_header_focal" DEFAULT 'bottom';
  ALTER TABLE "_pages_v_blocks_news_ticker" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_timeline" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_stats_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_awards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_article_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_logo_wall" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_quote" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_numbered_features" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_ta_cta" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_video_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_mission_circles" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_icon_features" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_icon_features" ADD COLUMN IF NOT EXISTS "heading" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN IF NOT EXISTS "heading" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN IF NOT EXISTS "body" varchar;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD COLUMN IF NOT EXISTS "footnote" varchar;
  ALTER TABLE "_pages_v_blocks_infographic" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_tabs_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_pillar_cards" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN IF NOT EXISTS "intro" varchar;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN IF NOT EXISTS "closing" varchar;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN IF NOT EXISTS "story_url" varchar;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD COLUMN IF NOT EXISTS "space_image_id" integer;
  ALTER TABLE "_pages_v_blocks_photo_strip" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  DO $$ BEGIN ALTER TABLE "pages_blocks_map_locations_sections" ADD CONSTRAINT "pages_blocks_map_locations_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_map_locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_map_locations_sections" ADD CONSTRAINT "_pages_v_blocks_map_locations_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_map_locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_locations_sections_order_idx" ON "pages_blocks_map_locations_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_locations_sections_parent_id_idx" ON "pages_blocks_map_locations_sections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_locations_sections_locale_idx" ON "pages_blocks_map_locations_sections" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_locations_sections_order_idx" ON "_pages_v_blocks_map_locations_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_locations_sections_parent_id_idx" ON "_pages_v_blocks_map_locations_sections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_locations_sections_locale_idx" ON "_pages_v_blocks_map_locations_sections" USING btree ("_locale");
  DO $$ BEGIN ALTER TABLE "pages_blocks_map_locations" ADD CONSTRAINT "pages_blocks_map_locations_space_image_id_media_id_fk" FOREIGN KEY ("space_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_map_locations" ADD CONSTRAINT "_pages_v_blocks_map_locations_space_image_id_media_id_fk" FOREIGN KEY ("space_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_locations_space_image_idx" ON "pages_blocks_map_locations" USING btree ("space_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_locations_space_image_idx" ON "_pages_v_blocks_map_locations" USING btree ("space_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 僅還原本 migration 真正新增者（focal）。其餘欄位/表早於本 migration 即存在（push 同步），
  // 不在此 down 範圍，避免誤刪客戶資料。
  await db.execute(sql`
  ALTER TABLE "pages_blocks_page_header" DROP COLUMN IF EXISTS "focal";
  ALTER TABLE "_pages_v_blocks_page_header" DROP COLUMN IF EXISTS "focal";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_page_header_focal";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_page_header_focal";`)
}
