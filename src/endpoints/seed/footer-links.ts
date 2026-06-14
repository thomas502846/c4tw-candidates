/**
 * 針對性更新：只把「官方 LINE / 官方 Facebook」兩列補進 site-footer 的「聯絡資訊」欄。
 * 為什麼不用 `pnpm seed`：完整 seed 會清空並重傳 media／S3（需要 content-assets 在機器上，
 * 否則重現破圖 bug）。本腳本只動 site-footer global，零碰 media。
 *
 * 冪等：已存在同 label 就跳過，可重複執行。
 * 用法：pnpm seed:footer（容器內 `docker compose run --rm migrate pnpm seed:footer`）
 * 注意：以 disableRevalidate 跑（script 不在 Next runtime，revalidateTag 會無效）；
 *       靠後續 `build app` 把新 footer 烙進靜態頁。
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../../payload.config'

const CONTACT_TITLES = ['聯絡資訊', 'Contact']

const EXTRA_LINKS = {
  'zh-TW': [
    { label: '官方 LINE：@564enhuc', url: 'https://lin.ee/xQ63Ufj' },
    { label: '官方 Facebook：CFT 照顧學校', url: 'https://www.facebook.com/p/CFT-照顧學校-61571463056013/' },
  ],
  en: [
    { label: 'Official LINE: @564enhuc', url: 'https://lin.ee/xQ63Ufj' },
    { label: 'Official Facebook: CFT Care School', url: 'https://www.facebook.com/p/CFT-照顧學校-61571463056013/' },
  ],
} as const

const run = async (): Promise<void> => {
  try {
    const payload = await getPayload({ config })

    for (const locale of ['zh-TW', 'en'] as const) {
      const footer = await payload.findGlobal({ slug: 'site-footer', locale, depth: 0 })
      const columns = footer.columns ?? []
      let changed = false

      const nextColumns = columns.map((column) => {
        if (!CONTACT_TITLES.includes(column.title)) return column
        const links = [...(column.links ?? [])]
        for (const want of EXTRA_LINKS[locale]) {
          const existing = links.find((l) => l.url === want.url)
          if (!existing) {
            // 尚未有此 url → 新增本地語系 label
            links.push({ ...want })
            changed = true
          } else if (existing.label !== want.label) {
            // url 已存在但 label 非本語系（en 因 locale fallback 落到 zh label）→ 校正
            existing.label = want.label
            changed = true
          }
        }
        return { ...column, links }
      })

      if (!changed) {
        payload.logger.info(`[${locale}] footer LINE/FB 已存在，跳過`)
        continue
      }

      await payload.updateGlobal({
        slug: 'site-footer',
        locale,
        context: { disableRevalidate: true },
        data: { columns: nextColumns },
      })
      payload.logger.info(`[${locale}] footer 已補上 LINE/FB 連結`)
    }

    payload.logger.info('Footer links update complete.')
    process.exit(0)
  } catch (err) {
    console.error('Footer links update failed:', err)
    process.exit(1)
  }
}

void run()
