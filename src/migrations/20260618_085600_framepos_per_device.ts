import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_background" AS ENUM('none', 'aio');
  CREATE TYPE "public"."enum__pages_v_blocks_content_background" AS ENUM('none', 'aio');
  ALTER TABLE "pages_blocks_page_header" ALTER COLUMN "focal" SET DEFAULT 'center';
  ALTER TABLE "_pages_v_blocks_page_header" ALTER COLUMN "focal" SET DEFAULT 'center';
  ALTER TABLE "pages_blocks_page_header" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "background" "enum_pages_blocks_content_background" DEFAULT 'none';
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_page_header" ADD COLUMN "frame_pos" jsonb;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "background" "enum__pages_v_blocks_content_background" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "frame_pos" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_page_header" ALTER COLUMN "focal" SET DEFAULT 'bottom';
  ALTER TABLE "_pages_v_blocks_page_header" ALTER COLUMN "focal" SET DEFAULT 'bottom';
  ALTER TABLE "pages_blocks_page_header" DROP COLUMN "frame_pos";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_page_header" DROP COLUMN "frame_pos";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "frame_pos";
  DROP TYPE "public"."enum_pages_blocks_content_background";
  DROP TYPE "public"."enum__pages_v_blocks_content_background";`)
}
