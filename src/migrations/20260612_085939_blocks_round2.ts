import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_ta_cta_variant" AS ENUM('tiles', 'photoCards');
  CREATE TYPE "public"."enum_pages_blocks_mission_circles_variant" AS ENUM('band', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_icon_features_variant" AS ENUM('cards', 'pillars');
  CREATE TYPE "public"."enum_pages_blocks_steps_block_variant" AS ENUM('cardRow', 'inline', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_infographic_variant" AS ENUM('venn', 'ring', 'radial');
  CREATE TYPE "public"."enum__pages_v_blocks_ta_cta_variant" AS ENUM('tiles', 'photoCards');
  CREATE TYPE "public"."enum__pages_v_blocks_mission_circles_variant" AS ENUM('band', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_features_variant" AS ENUM('cards', 'pillars');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_block_variant" AS ENUM('cardRow', 'inline', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_infographic_variant" AS ENUM('venn', 'ring', 'radial');
  CREATE TABLE "pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"eyebrow" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_numbered_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ta_cta_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"button_label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_ta_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_ta_cta_variant" DEFAULT 'tiles',
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"poster_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mission_circles_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_mission_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_mission_circles_variant" DEFAULT 'band',
  	"title" varchar,
  	"slogan" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_icon_features_variant" DEFAULT 'cards',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_steps_block_variant" DEFAULT 'cardRow',
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_infographic_left_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_infographic_right_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_infographic_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_infographic_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_infographic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_infographic_variant" DEFAULT 'venn',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"left_label" varchar,
  	"right_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_block_tabs_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_block_tabs_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"heading" varchar,
  	"subheading" varchar,
  	"body" varchar,
  	"features_label" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pillar_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"icon_id" integer,
  	"title_main" varchar,
  	"title_sub" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map_locations_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"name_en" varchar
  );
  
  CREATE TABLE "pages_blocks_map_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"eyebrow" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ta_cta_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"button_label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ta_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_ta_cta_variant" DEFAULT 'tiles',
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"poster_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_circles_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mission_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_mission_circles_variant" DEFAULT 'band',
  	"title" varchar,
  	"slogan" varchar,
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_icon_features_variant" DEFAULT 'cards',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_steps_block_variant" DEFAULT 'cardRow',
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infographic_left_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infographic_right_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infographic_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infographic_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_infographic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_infographic_variant" DEFAULT 'venn',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"left_label" varchar,
  	"right_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_block_tabs_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_block_tabs_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"heading" varchar,
  	"subheading" varchar,
  	"body" varchar,
  	"features_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillar_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"icon_id" integer,
  	"title_main" varchar,
  	"title_sub" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map_locations_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"name_en" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_features_items" ADD CONSTRAINT "pages_blocks_numbered_features_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_features_items" ADD CONSTRAINT "pages_blocks_numbered_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_numbered_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_features" ADD CONSTRAINT "pages_blocks_numbered_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ta_cta_cards" ADD CONSTRAINT "pages_blocks_ta_cta_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_ta_cta_cards" ADD CONSTRAINT "pages_blocks_ta_cta_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ta_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ta_cta" ADD CONSTRAINT "pages_blocks_ta_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_block" ADD CONSTRAINT "pages_blocks_video_block_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_block" ADD CONSTRAINT "pages_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_circles_circles" ADD CONSTRAINT "pages_blocks_mission_circles_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_mission_circles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_circles" ADD CONSTRAINT "pages_blocks_mission_circles_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_mission_circles" ADD CONSTRAINT "pages_blocks_mission_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_features_items" ADD CONSTRAINT "pages_blocks_icon_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_features_items" ADD CONSTRAINT "pages_blocks_icon_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_features" ADD CONSTRAINT "pages_blocks_icon_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block_items" ADD CONSTRAINT "pages_blocks_steps_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block_items" ADD CONSTRAINT "pages_blocks_steps_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_block" ADD CONSTRAINT "pages_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_left_stats" ADD CONSTRAINT "pages_blocks_infographic_left_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_right_stats" ADD CONSTRAINT "pages_blocks_infographic_right_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_photos" ADD CONSTRAINT "pages_blocks_infographic_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_photos" ADD CONSTRAINT "pages_blocks_infographic_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_nodes" ADD CONSTRAINT "pages_blocks_infographic_nodes_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic_nodes" ADD CONSTRAINT "pages_blocks_infographic_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_infographic" ADD CONSTRAINT "pages_blocks_infographic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_block_tabs_pills" ADD CONSTRAINT "pages_blocks_tabs_block_tabs_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs_block_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_block_tabs_features" ADD CONSTRAINT "pages_blocks_tabs_block_tabs_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs_block_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_block_tabs" ADD CONSTRAINT "pages_blocks_tabs_block_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_block_tabs" ADD CONSTRAINT "pages_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_block" ADD CONSTRAINT "pages_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillar_cards_cards" ADD CONSTRAINT "pages_blocks_pillar_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillar_cards_cards" ADD CONSTRAINT "pages_blocks_pillar_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillar_cards" ADD CONSTRAINT "pages_blocks_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_locations_locations" ADD CONSTRAINT "pages_blocks_map_locations_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_map_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_locations" ADD CONSTRAINT "pages_blocks_map_locations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_locations" ADD CONSTRAINT "pages_blocks_map_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_features_items" ADD CONSTRAINT "_pages_v_blocks_numbered_features_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_features_items" ADD CONSTRAINT "_pages_v_blocks_numbered_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_numbered_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_features" ADD CONSTRAINT "_pages_v_blocks_numbered_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ta_cta_cards" ADD CONSTRAINT "_pages_v_blocks_ta_cta_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ta_cta_cards" ADD CONSTRAINT "_pages_v_blocks_ta_cta_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ta_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ta_cta" ADD CONSTRAINT "_pages_v_blocks_ta_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_block" ADD CONSTRAINT "_pages_v_blocks_video_block_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_block" ADD CONSTRAINT "_pages_v_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_circles_circles" ADD CONSTRAINT "_pages_v_blocks_mission_circles_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_mission_circles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_circles" ADD CONSTRAINT "_pages_v_blocks_mission_circles_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mission_circles" ADD CONSTRAINT "_pages_v_blocks_mission_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_features_items" ADD CONSTRAINT "_pages_v_blocks_icon_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_features_items" ADD CONSTRAINT "_pages_v_blocks_icon_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_features" ADD CONSTRAINT "_pages_v_blocks_icon_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block_items" ADD CONSTRAINT "_pages_v_blocks_steps_block_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block_items" ADD CONSTRAINT "_pages_v_blocks_steps_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_block" ADD CONSTRAINT "_pages_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_left_stats" ADD CONSTRAINT "_pages_v_blocks_infographic_left_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_right_stats" ADD CONSTRAINT "_pages_v_blocks_infographic_right_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_photos" ADD CONSTRAINT "_pages_v_blocks_infographic_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_photos" ADD CONSTRAINT "_pages_v_blocks_infographic_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_nodes" ADD CONSTRAINT "_pages_v_blocks_infographic_nodes_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic_nodes" ADD CONSTRAINT "_pages_v_blocks_infographic_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_infographic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_infographic" ADD CONSTRAINT "_pages_v_blocks_infographic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs_pills" ADD CONSTRAINT "_pages_v_blocks_tabs_block_tabs_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs_block_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs_features" ADD CONSTRAINT "_pages_v_blocks_tabs_block_tabs_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs_block_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_block_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_block" ADD CONSTRAINT "_pages_v_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillar_cards_cards" ADD CONSTRAINT "_pages_v_blocks_pillar_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillar_cards_cards" ADD CONSTRAINT "_pages_v_blocks_pillar_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillar_cards" ADD CONSTRAINT "_pages_v_blocks_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_locations_locations" ADD CONSTRAINT "_pages_v_blocks_map_locations_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_map_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD CONSTRAINT "_pages_v_blocks_map_locations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_locations" ADD CONSTRAINT "_pages_v_blocks_map_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_locale_idx" ON "pages_blocks_page_header" USING btree ("_locale");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "pages_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "pages_blocks_numbered_features_items_order_idx" ON "pages_blocks_numbered_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_features_items_parent_id_idx" ON "pages_blocks_numbered_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_features_items_locale_idx" ON "pages_blocks_numbered_features_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_numbered_features_items_image_idx" ON "pages_blocks_numbered_features_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_numbered_features_order_idx" ON "pages_blocks_numbered_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_features_parent_id_idx" ON "pages_blocks_numbered_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_features_path_idx" ON "pages_blocks_numbered_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_numbered_features_locale_idx" ON "pages_blocks_numbered_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_ta_cta_cards_order_idx" ON "pages_blocks_ta_cta_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_ta_cta_cards_parent_id_idx" ON "pages_blocks_ta_cta_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ta_cta_cards_locale_idx" ON "pages_blocks_ta_cta_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_ta_cta_cards_image_idx" ON "pages_blocks_ta_cta_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_ta_cta_order_idx" ON "pages_blocks_ta_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_ta_cta_parent_id_idx" ON "pages_blocks_ta_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ta_cta_path_idx" ON "pages_blocks_ta_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_ta_cta_locale_idx" ON "pages_blocks_ta_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_block_order_idx" ON "pages_blocks_video_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_block_parent_id_idx" ON "pages_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_block_path_idx" ON "pages_blocks_video_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_block_locale_idx" ON "pages_blocks_video_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_block_poster_idx" ON "pages_blocks_video_block" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_mission_circles_circles_order_idx" ON "pages_blocks_mission_circles_circles" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_circles_circles_parent_id_idx" ON "pages_blocks_mission_circles_circles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_circles_circles_locale_idx" ON "pages_blocks_mission_circles_circles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_mission_circles_order_idx" ON "pages_blocks_mission_circles" USING btree ("_order");
  CREATE INDEX "pages_blocks_mission_circles_parent_id_idx" ON "pages_blocks_mission_circles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mission_circles_path_idx" ON "pages_blocks_mission_circles" USING btree ("_path");
  CREATE INDEX "pages_blocks_mission_circles_locale_idx" ON "pages_blocks_mission_circles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_mission_circles_background_image_idx" ON "pages_blocks_mission_circles" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_icon_features_items_order_idx" ON "pages_blocks_icon_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_features_items_parent_id_idx" ON "pages_blocks_icon_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_features_items_locale_idx" ON "pages_blocks_icon_features_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_icon_features_items_icon_idx" ON "pages_blocks_icon_features_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_icon_features_order_idx" ON "pages_blocks_icon_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_features_parent_id_idx" ON "pages_blocks_icon_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_features_path_idx" ON "pages_blocks_icon_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_icon_features_locale_idx" ON "pages_blocks_icon_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_block_items_order_idx" ON "pages_blocks_steps_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_block_items_parent_id_idx" ON "pages_blocks_steps_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_block_items_locale_idx" ON "pages_blocks_steps_block_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_block_items_icon_idx" ON "pages_blocks_steps_block_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_steps_block_order_idx" ON "pages_blocks_steps_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_block_parent_id_idx" ON "pages_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_block_path_idx" ON "pages_blocks_steps_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_block_locale_idx" ON "pages_blocks_steps_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_infographic_left_stats_order_idx" ON "pages_blocks_infographic_left_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_infographic_left_stats_parent_id_idx" ON "pages_blocks_infographic_left_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infographic_left_stats_locale_idx" ON "pages_blocks_infographic_left_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_infographic_right_stats_order_idx" ON "pages_blocks_infographic_right_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_infographic_right_stats_parent_id_idx" ON "pages_blocks_infographic_right_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infographic_right_stats_locale_idx" ON "pages_blocks_infographic_right_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_infographic_photos_order_idx" ON "pages_blocks_infographic_photos" USING btree ("_order");
  CREATE INDEX "pages_blocks_infographic_photos_parent_id_idx" ON "pages_blocks_infographic_photos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infographic_photos_locale_idx" ON "pages_blocks_infographic_photos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_infographic_photos_image_idx" ON "pages_blocks_infographic_photos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_infographic_nodes_order_idx" ON "pages_blocks_infographic_nodes" USING btree ("_order");
  CREATE INDEX "pages_blocks_infographic_nodes_parent_id_idx" ON "pages_blocks_infographic_nodes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infographic_nodes_locale_idx" ON "pages_blocks_infographic_nodes" USING btree ("_locale");
  CREATE INDEX "pages_blocks_infographic_nodes_icon_idx" ON "pages_blocks_infographic_nodes" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_infographic_order_idx" ON "pages_blocks_infographic" USING btree ("_order");
  CREATE INDEX "pages_blocks_infographic_parent_id_idx" ON "pages_blocks_infographic" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_infographic_path_idx" ON "pages_blocks_infographic" USING btree ("_path");
  CREATE INDEX "pages_blocks_infographic_locale_idx" ON "pages_blocks_infographic" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_block_tabs_pills_order_idx" ON "pages_blocks_tabs_block_tabs_pills" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_block_tabs_pills_parent_id_idx" ON "pages_blocks_tabs_block_tabs_pills" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_block_tabs_pills_locale_idx" ON "pages_blocks_tabs_block_tabs_pills" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_block_tabs_features_order_idx" ON "pages_blocks_tabs_block_tabs_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_block_tabs_features_parent_id_idx" ON "pages_blocks_tabs_block_tabs_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_block_tabs_features_locale_idx" ON "pages_blocks_tabs_block_tabs_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_block_tabs_order_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_block_tabs_parent_id_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_block_tabs_locale_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_tabs_block_tabs_image_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_tabs_block_order_idx" ON "pages_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_block_parent_id_idx" ON "pages_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_block_path_idx" ON "pages_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_tabs_block_locale_idx" ON "pages_blocks_tabs_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pillar_cards_cards_order_idx" ON "pages_blocks_pillar_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillar_cards_cards_parent_id_idx" ON "pages_blocks_pillar_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillar_cards_cards_locale_idx" ON "pages_blocks_pillar_cards_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pillar_cards_cards_icon_idx" ON "pages_blocks_pillar_cards_cards" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_pillar_cards_order_idx" ON "pages_blocks_pillar_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillar_cards_parent_id_idx" ON "pages_blocks_pillar_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillar_cards_path_idx" ON "pages_blocks_pillar_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_pillar_cards_locale_idx" ON "pages_blocks_pillar_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_map_locations_locations_order_idx" ON "pages_blocks_map_locations_locations" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_locations_locations_parent_id_idx" ON "pages_blocks_map_locations_locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_locations_locations_locale_idx" ON "pages_blocks_map_locations_locations" USING btree ("_locale");
  CREATE INDEX "pages_blocks_map_locations_order_idx" ON "pages_blocks_map_locations" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_locations_parent_id_idx" ON "pages_blocks_map_locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_locations_path_idx" ON "pages_blocks_map_locations" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_locations_locale_idx" ON "pages_blocks_map_locations" USING btree ("_locale");
  CREATE INDEX "pages_blocks_map_locations_image_idx" ON "pages_blocks_map_locations" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_locale_idx" ON "_pages_v_blocks_page_header" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_numbered_features_items_order_idx" ON "_pages_v_blocks_numbered_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_features_items_parent_id_idx" ON "_pages_v_blocks_numbered_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_features_items_locale_idx" ON "_pages_v_blocks_numbered_features_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_numbered_features_items_image_idx" ON "_pages_v_blocks_numbered_features_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_numbered_features_order_idx" ON "_pages_v_blocks_numbered_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_features_parent_id_idx" ON "_pages_v_blocks_numbered_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_features_path_idx" ON "_pages_v_blocks_numbered_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_numbered_features_locale_idx" ON "_pages_v_blocks_numbered_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_ta_cta_cards_order_idx" ON "_pages_v_blocks_ta_cta_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ta_cta_cards_parent_id_idx" ON "_pages_v_blocks_ta_cta_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ta_cta_cards_locale_idx" ON "_pages_v_blocks_ta_cta_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_ta_cta_cards_image_idx" ON "_pages_v_blocks_ta_cta_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_ta_cta_order_idx" ON "_pages_v_blocks_ta_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ta_cta_parent_id_idx" ON "_pages_v_blocks_ta_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ta_cta_path_idx" ON "_pages_v_blocks_ta_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_ta_cta_locale_idx" ON "_pages_v_blocks_ta_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_block_order_idx" ON "_pages_v_blocks_video_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_block_parent_id_idx" ON "_pages_v_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_block_path_idx" ON "_pages_v_blocks_video_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_block_locale_idx" ON "_pages_v_blocks_video_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_block_poster_idx" ON "_pages_v_blocks_video_block" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_mission_circles_circles_order_idx" ON "_pages_v_blocks_mission_circles_circles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_circles_circles_parent_id_idx" ON "_pages_v_blocks_mission_circles_circles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_circles_circles_locale_idx" ON "_pages_v_blocks_mission_circles_circles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_mission_circles_order_idx" ON "_pages_v_blocks_mission_circles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mission_circles_parent_id_idx" ON "_pages_v_blocks_mission_circles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mission_circles_path_idx" ON "_pages_v_blocks_mission_circles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mission_circles_locale_idx" ON "_pages_v_blocks_mission_circles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_mission_circles_background_image_idx" ON "_pages_v_blocks_mission_circles" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_icon_features_items_order_idx" ON "_pages_v_blocks_icon_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_features_items_parent_id_idx" ON "_pages_v_blocks_icon_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_features_items_locale_idx" ON "_pages_v_blocks_icon_features_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_icon_features_items_icon_idx" ON "_pages_v_blocks_icon_features_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_icon_features_order_idx" ON "_pages_v_blocks_icon_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_features_parent_id_idx" ON "_pages_v_blocks_icon_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_features_path_idx" ON "_pages_v_blocks_icon_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_icon_features_locale_idx" ON "_pages_v_blocks_icon_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_block_items_order_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_block_items_parent_id_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_block_items_locale_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_block_items_icon_idx" ON "_pages_v_blocks_steps_block_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_steps_block_order_idx" ON "_pages_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_block_parent_id_idx" ON "_pages_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_block_path_idx" ON "_pages_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_block_locale_idx" ON "_pages_v_blocks_steps_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_infographic_left_stats_order_idx" ON "_pages_v_blocks_infographic_left_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infographic_left_stats_parent_id_idx" ON "_pages_v_blocks_infographic_left_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infographic_left_stats_locale_idx" ON "_pages_v_blocks_infographic_left_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_infographic_right_stats_order_idx" ON "_pages_v_blocks_infographic_right_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infographic_right_stats_parent_id_idx" ON "_pages_v_blocks_infographic_right_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infographic_right_stats_locale_idx" ON "_pages_v_blocks_infographic_right_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_infographic_photos_order_idx" ON "_pages_v_blocks_infographic_photos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infographic_photos_parent_id_idx" ON "_pages_v_blocks_infographic_photos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infographic_photos_locale_idx" ON "_pages_v_blocks_infographic_photos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_infographic_photos_image_idx" ON "_pages_v_blocks_infographic_photos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_infographic_nodes_order_idx" ON "_pages_v_blocks_infographic_nodes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infographic_nodes_parent_id_idx" ON "_pages_v_blocks_infographic_nodes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infographic_nodes_locale_idx" ON "_pages_v_blocks_infographic_nodes" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_infographic_nodes_icon_idx" ON "_pages_v_blocks_infographic_nodes" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_infographic_order_idx" ON "_pages_v_blocks_infographic" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_infographic_parent_id_idx" ON "_pages_v_blocks_infographic" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_infographic_path_idx" ON "_pages_v_blocks_infographic" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_infographic_locale_idx" ON "_pages_v_blocks_infographic" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_pills_order_idx" ON "_pages_v_blocks_tabs_block_tabs_pills" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_pills_parent_id_idx" ON "_pages_v_blocks_tabs_block_tabs_pills" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_pills_locale_idx" ON "_pages_v_blocks_tabs_block_tabs_pills" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_features_order_idx" ON "_pages_v_blocks_tabs_block_tabs_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_features_parent_id_idx" ON "_pages_v_blocks_tabs_block_tabs_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_features_locale_idx" ON "_pages_v_blocks_tabs_block_tabs_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_order_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_parent_id_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_locale_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_tabs_block_tabs_image_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_tabs_block_order_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_block_parent_id_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_block_path_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tabs_block_locale_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pillar_cards_cards_order_idx" ON "_pages_v_blocks_pillar_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillar_cards_cards_parent_id_idx" ON "_pages_v_blocks_pillar_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillar_cards_cards_locale_idx" ON "_pages_v_blocks_pillar_cards_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pillar_cards_cards_icon_idx" ON "_pages_v_blocks_pillar_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_pillar_cards_order_idx" ON "_pages_v_blocks_pillar_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillar_cards_parent_id_idx" ON "_pages_v_blocks_pillar_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillar_cards_path_idx" ON "_pages_v_blocks_pillar_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pillar_cards_locale_idx" ON "_pages_v_blocks_pillar_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_map_locations_locations_order_idx" ON "_pages_v_blocks_map_locations_locations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_locations_locations_parent_id_idx" ON "_pages_v_blocks_map_locations_locations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_locations_locations_locale_idx" ON "_pages_v_blocks_map_locations_locations" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_map_locations_order_idx" ON "_pages_v_blocks_map_locations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_locations_parent_id_idx" ON "_pages_v_blocks_map_locations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_locations_path_idx" ON "_pages_v_blocks_map_locations" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_locations_locale_idx" ON "_pages_v_blocks_map_locations" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_map_locations_image_idx" ON "_pages_v_blocks_map_locations" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_page_header" CASCADE;
  DROP TABLE "pages_blocks_numbered_features_items" CASCADE;
  DROP TABLE "pages_blocks_numbered_features" CASCADE;
  DROP TABLE "pages_blocks_ta_cta_cards" CASCADE;
  DROP TABLE "pages_blocks_ta_cta" CASCADE;
  DROP TABLE "pages_blocks_video_block" CASCADE;
  DROP TABLE "pages_blocks_mission_circles_circles" CASCADE;
  DROP TABLE "pages_blocks_mission_circles" CASCADE;
  DROP TABLE "pages_blocks_icon_features_items" CASCADE;
  DROP TABLE "pages_blocks_icon_features" CASCADE;
  DROP TABLE "pages_blocks_steps_block_items" CASCADE;
  DROP TABLE "pages_blocks_steps_block" CASCADE;
  DROP TABLE "pages_blocks_infographic_left_stats" CASCADE;
  DROP TABLE "pages_blocks_infographic_right_stats" CASCADE;
  DROP TABLE "pages_blocks_infographic_photos" CASCADE;
  DROP TABLE "pages_blocks_infographic_nodes" CASCADE;
  DROP TABLE "pages_blocks_infographic" CASCADE;
  DROP TABLE "pages_blocks_tabs_block_tabs_pills" CASCADE;
  DROP TABLE "pages_blocks_tabs_block_tabs_features" CASCADE;
  DROP TABLE "pages_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE "pages_blocks_tabs_block" CASCADE;
  DROP TABLE "pages_blocks_pillar_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_pillar_cards" CASCADE;
  DROP TABLE "pages_blocks_map_locations_locations" CASCADE;
  DROP TABLE "pages_blocks_map_locations" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_features" CASCADE;
  DROP TABLE "_pages_v_blocks_ta_cta_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_ta_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_video_block" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_circles_circles" CASCADE;
  DROP TABLE "_pages_v_blocks_mission_circles" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_features" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block" CASCADE;
  DROP TABLE "_pages_v_blocks_infographic_left_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_infographic_right_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_infographic_photos" CASCADE;
  DROP TABLE "_pages_v_blocks_infographic_nodes" CASCADE;
  DROP TABLE "_pages_v_blocks_infographic" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block_tabs_pills" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block_tabs_features" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block" CASCADE;
  DROP TABLE "_pages_v_blocks_pillar_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_pillar_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_map_locations_locations" CASCADE;
  DROP TABLE "_pages_v_blocks_map_locations" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_ta_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_mission_circles_variant";
  DROP TYPE "public"."enum_pages_blocks_icon_features_variant";
  DROP TYPE "public"."enum_pages_blocks_steps_block_variant";
  DROP TYPE "public"."enum_pages_blocks_infographic_variant";
  DROP TYPE "public"."enum__pages_v_blocks_ta_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_mission_circles_variant";
  DROP TYPE "public"."enum__pages_v_blocks_icon_features_variant";
  DROP TYPE "public"."enum__pages_v_blocks_steps_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_infographic_variant";`)
}
