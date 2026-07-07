import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "cover_frame_pos" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_cover_frame_pos" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "cover_frame_pos";
  ALTER TABLE "_posts_v" DROP COLUMN "version_cover_frame_pos";`)
}
