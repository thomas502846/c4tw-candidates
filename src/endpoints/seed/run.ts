/**
 * Seed runner：`pnpm seed`
 * 以 Payload Local API 重建 demo 內容（pages / media / 大事紀 / 獲獎 / 案例故事 / navigation / site-footer）。
 * 需要 DATABASE_URI 可連線（本機 docker c4twweb-pg, port 5433）。
 */
import 'dotenv/config'

import { createLocalReq, getPayload } from 'payload'

import config from '../../payload.config'
import { seed } from './index'

const run = async (): Promise<void> => {
  try {
    const payload = await getPayload({ config })
    const req = await createLocalReq({}, payload)
    await seed({ payload, req })
    payload.logger.info('Seed complete.')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

void run()
