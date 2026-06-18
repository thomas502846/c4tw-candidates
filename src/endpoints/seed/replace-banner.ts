/**
 * 針對性更新：只把 training banner 的媒體檔換成新圖（Figma 269:667 課程實況照），
 * 不碰 pages／其他 media。沿用既有 media doc id → 頁面的 image 關聯不變，僅檔案內容換新
 * （Payload update + filePath 會重生 Sharp 尺寸、重傳 S3、bump updatedAt 觸發快取破壞）。
 *
 * 為什麼不用 `pnpm seed`：完整 seed 會清空並重傳所有 media／S3 並重建 pages，
 * 會洗掉客戶在 CMS 的既存編輯。本腳本只動一張圖。
 *
 * 用法（容器內，需掛載 content-assets）：
 *   docker compose --profile migrate run --rm -T \
 *     -v $PWD/content-assets:/app/content-assets migrate pnpm seed:banner
 * 之後 `build app` 把新 updatedAt 烙進 SSG 靜態頁。
 */
import 'dotenv/config'

import path from 'path'

import { getPayload } from 'payload'

import config from '../../payload.config'

const FILENAME = 'training-banner.jpg'
const ALT = 'AIO組織培力 banner'
const SRC = path.resolve(process.cwd(), 'content-assets/photos/figma', FILENAME)

const run = async (): Promise<void> => {
  try {
    const payload = await getPayload({ config })

    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: FILENAME } },
      limit: 1,
      depth: 0,
    })

    if (!found.docs.length) {
      payload.logger.error(`media「${FILENAME}」找不到，無法更新（可能尚未 seed）`)
      process.exit(1)
    }

    const doc = found.docs[0]
    await payload.update({
      collection: 'media',
      id: doc.id,
      context: { disableRevalidate: true },
      data: { alt: ALT },
      filePath: SRC,
    })

    payload.logger.info(`media「${FILENAME}」(id=${doc.id}) 已換新圖：${SRC}`)
    payload.logger.info('Banner image replace complete.')
    process.exit(0)
  } catch (err) {
    console.error('Banner image replace failed:', err)
    process.exit(1)
  }
}

void run()
