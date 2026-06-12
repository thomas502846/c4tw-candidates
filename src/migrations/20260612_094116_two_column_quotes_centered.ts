import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_two_column_variant" ADD VALUE IF NOT EXISTS 'quotes';
  ALTER TYPE "public"."enum_pages_blocks_two_column_variant" ADD VALUE IF NOT EXISTS 'centered';
  ALTER TYPE "public"."enum_pages_blocks_ta_cta_variant" ADD VALUE IF NOT EXISTS 'photoBand';
  ALTER TYPE "public"."enum__pages_v_blocks_two_column_variant" ADD VALUE IF NOT EXISTS 'quotes';
  ALTER TYPE "public"."enum__pages_v_blocks_two_column_variant" ADD VALUE IF NOT EXISTS 'centered';
  ALTER TYPE "public"."enum__pages_v_blocks_ta_cta_variant" ADD VALUE IF NOT EXISTS 'photoBand';
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "lead" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "lead" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_two_column" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_two_column" ALTER COLUMN "variant" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum_pages_blocks_two_column_variant";
  CREATE TYPE "public"."enum_pages_blocks_two_column_variant" AS ENUM('standard', 'hero');
  ALTER TABLE "pages_blocks_two_column" ALTER COLUMN "variant" SET DEFAULT 'standard'::"public"."enum_pages_blocks_two_column_variant";
  ALTER TABLE "pages_blocks_two_column" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_two_column_variant" USING "variant"::"public"."enum_pages_blocks_two_column_variant";
  ALTER TABLE "pages_blocks_ta_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_ta_cta" ALTER COLUMN "variant" SET DEFAULT 'tiles'::text;
  DROP TYPE "public"."enum_pages_blocks_ta_cta_variant";
  CREATE TYPE "public"."enum_pages_blocks_ta_cta_variant" AS ENUM('tiles', 'photoCards');
  ALTER TABLE "pages_blocks_ta_cta" ALTER COLUMN "variant" SET DEFAULT 'tiles'::"public"."enum_pages_blocks_ta_cta_variant";
  ALTER TABLE "pages_blocks_ta_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_ta_cta_variant" USING "variant"::"public"."enum_pages_blocks_ta_cta_variant";
  ALTER TABLE "_pages_v_blocks_two_column" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_two_column" ALTER COLUMN "variant" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum__pages_v_blocks_two_column_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_variant" AS ENUM('standard', 'hero');
  ALTER TABLE "_pages_v_blocks_two_column" ALTER COLUMN "variant" SET DEFAULT 'standard'::"public"."enum__pages_v_blocks_two_column_variant";
  ALTER TABLE "_pages_v_blocks_two_column" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_two_column_variant" USING "variant"::"public"."enum__pages_v_blocks_two_column_variant";
  ALTER TABLE "_pages_v_blocks_ta_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_ta_cta" ALTER COLUMN "variant" SET DEFAULT 'tiles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_ta_cta_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_ta_cta_variant" AS ENUM('tiles', 'photoCards');
  ALTER TABLE "_pages_v_blocks_ta_cta" ALTER COLUMN "variant" SET DEFAULT 'tiles'::"public"."enum__pages_v_blocks_ta_cta_variant";
  ALTER TABLE "_pages_v_blocks_ta_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_ta_cta_variant" USING "variant"::"public"."enum__pages_v_blocks_ta_cta_variant";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "lead";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "lead";`)
}
