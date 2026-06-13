import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_content_align" AS ENUM('left', 'center');
  CREATE TABLE "pages_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_photo_strip_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"parallax" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photo_strip_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"parallax" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_content" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "align" "enum_pages_blocks_content_align" DEFAULT 'left';
  ALTER TABLE "pages_blocks_content" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "pages_blocks_timeline" ADD COLUMN "show_description" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_article_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_article_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_article_cards" ADD COLUMN "lead_image_id" integer;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "align" "enum__pages_v_blocks_content_align" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_timeline" ADD COLUMN "show_description" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_article_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_article_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_article_cards" ADD COLUMN "lead_image_id" integer;
  ALTER TABLE "pages_blocks_two_column_images" ADD CONSTRAINT "pages_blocks_two_column_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_images" ADD CONSTRAINT "pages_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_column"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_images" ADD CONSTRAINT "pages_blocks_photo_strip_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip_images" ADD CONSTRAINT "pages_blocks_photo_strip_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_strip" ADD CONSTRAINT "pages_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_images" ADD CONSTRAINT "_pages_v_blocks_two_column_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_images" ADD CONSTRAINT "_pages_v_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_column"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip_images" ADD CONSTRAINT "_pages_v_blocks_photo_strip_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip_images" ADD CONSTRAINT "_pages_v_blocks_photo_strip_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_photo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photo_strip" ADD CONSTRAINT "_pages_v_blocks_photo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_two_column_images_order_idx" ON "pages_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_column_images_parent_id_idx" ON "pages_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_column_images_locale_idx" ON "pages_blocks_two_column_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_two_column_images_image_idx" ON "pages_blocks_two_column_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_strip_images_order_idx" ON "pages_blocks_photo_strip_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_images_parent_id_idx" ON "pages_blocks_photo_strip_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_images_locale_idx" ON "pages_blocks_photo_strip_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_photo_strip_images_image_idx" ON "pages_blocks_photo_strip_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_strip_order_idx" ON "pages_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_strip_parent_id_idx" ON "pages_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_strip_path_idx" ON "pages_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_photo_strip_locale_idx" ON "pages_blocks_photo_strip" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_column_images_order_idx" ON "_pages_v_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_column_images_parent_id_idx" ON "_pages_v_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_column_images_locale_idx" ON "_pages_v_blocks_two_column_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_column_images_image_idx" ON "_pages_v_blocks_two_column_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_images_order_idx" ON "_pages_v_blocks_photo_strip_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photo_strip_images_parent_id_idx" ON "_pages_v_blocks_photo_strip_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_images_locale_idx" ON "_pages_v_blocks_photo_strip_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_photo_strip_images_image_idx" ON "_pages_v_blocks_photo_strip_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_order_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photo_strip_parent_id_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photo_strip_path_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_photo_strip_locale_idx" ON "_pages_v_blocks_photo_strip" USING btree ("_locale");
  ALTER TABLE "pages_blocks_article_cards" ADD CONSTRAINT "pages_blocks_article_cards_lead_image_id_media_id_fk" FOREIGN KEY ("lead_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_article_cards" ADD CONSTRAINT "_pages_v_blocks_article_cards_lead_image_id_media_id_fk" FOREIGN KEY ("lead_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_article_cards_lead_image_idx" ON "pages_blocks_article_cards" USING btree ("lead_image_id");
  CREATE INDEX "_pages_v_blocks_article_cards_lead_image_idx" ON "_pages_v_blocks_article_cards" USING btree ("lead_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_two_column_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_photo_strip_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_photo_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_two_column_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_photo_strip_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_photo_strip" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_two_column_images" CASCADE;
  DROP TABLE "pages_blocks_photo_strip_images" CASCADE;
  DROP TABLE "pages_blocks_photo_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column_images" CASCADE;
  DROP TABLE "_pages_v_blocks_photo_strip_images" CASCADE;
  DROP TABLE "_pages_v_blocks_photo_strip" CASCADE;
  ALTER TABLE "pages_blocks_article_cards" DROP CONSTRAINT "pages_blocks_article_cards_lead_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_article_cards" DROP CONSTRAINT "_pages_v_blocks_article_cards_lead_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_article_cards_lead_image_idx";
  DROP INDEX "_pages_v_blocks_article_cards_lead_image_idx";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "align";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "cta_url";
  ALTER TABLE "pages_blocks_timeline" DROP COLUMN "show_description";
  ALTER TABLE "pages_blocks_article_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_article_cards" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_article_cards" DROP COLUMN "lead_image_id";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "align";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_timeline" DROP COLUMN "show_description";
  ALTER TABLE "_pages_v_blocks_article_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_article_cards" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_article_cards" DROP COLUMN "lead_image_id";
  DROP TYPE "public"."enum_pages_blocks_content_align";
  DROP TYPE "public"."enum__pages_v_blocks_content_align";`)
}
