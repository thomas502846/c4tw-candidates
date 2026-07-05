import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_team_carousel_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar
  );
  
  CREATE TABLE "pages_blocks_team_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_carousel_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_content" ADD COLUMN "accordion_label" varchar;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "accordion_content" jsonb;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "audio_id" integer;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "video_url" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "accordion_label" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "accordion_content" jsonb;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "audio_id" integer;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "video_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_posts_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_team_carousel_members" ADD CONSTRAINT "pages_blocks_team_carousel_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_carousel_members" ADD CONSTRAINT "pages_blocks_team_carousel_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_carousel" ADD CONSTRAINT "pages_blocks_team_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_carousel_members" ADD CONSTRAINT "_pages_v_blocks_team_carousel_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_carousel_members" ADD CONSTRAINT "_pages_v_blocks_team_carousel_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_carousel" ADD CONSTRAINT "_pages_v_blocks_team_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_carousel_members_order_idx" ON "pages_blocks_team_carousel_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_carousel_members_parent_id_idx" ON "pages_blocks_team_carousel_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_carousel_members_locale_idx" ON "pages_blocks_team_carousel_members" USING btree ("_locale");
  CREATE INDEX "pages_blocks_team_carousel_members_photo_idx" ON "pages_blocks_team_carousel_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_carousel_order_idx" ON "pages_blocks_team_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_carousel_parent_id_idx" ON "pages_blocks_team_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_carousel_path_idx" ON "pages_blocks_team_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_carousel_locale_idx" ON "pages_blocks_team_carousel" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_team_carousel_members_order_idx" ON "_pages_v_blocks_team_carousel_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_carousel_members_parent_id_idx" ON "_pages_v_blocks_team_carousel_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_carousel_members_locale_idx" ON "_pages_v_blocks_team_carousel_members" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_team_carousel_members_photo_idx" ON "_pages_v_blocks_team_carousel_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_carousel_order_idx" ON "_pages_v_blocks_team_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_carousel_parent_id_idx" ON "_pages_v_blocks_team_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_carousel_path_idx" ON "_pages_v_blocks_team_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_carousel_locale_idx" ON "_pages_v_blocks_team_carousel" USING btree ("_locale");
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_audio_idx" ON "pages_blocks_content" USING btree ("audio_id");
  CREATE INDEX "_pages_v_blocks_content_audio_idx" ON "_pages_v_blocks_content" USING btree ("audio_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_carousel_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_carousel_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_carousel" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_team_carousel_members" CASCADE;
  DROP TABLE "pages_blocks_team_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_team_carousel_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team_carousel" CASCADE;
  ALTER TABLE "pages_blocks_content" DROP CONSTRAINT "pages_blocks_content_audio_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_content" DROP CONSTRAINT "_pages_v_blocks_content_audio_id_media_id_fk";
  
  DROP INDEX "pages_blocks_content_audio_idx";
  DROP INDEX "_pages_v_blocks_content_audio_idx";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "accordion_label";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "accordion_content";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "audio_id";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "video_url";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "accordion_label";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "accordion_content";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "audio_id";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "video_url";
  ALTER TABLE "posts" DROP COLUMN "views";
  ALTER TABLE "_posts_v" DROP COLUMN "version_views";`)
}
