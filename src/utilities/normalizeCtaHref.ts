/**
 * CTA 連結正規化：把指向「聯絡頁」的 CTA（聯絡我們／諮詢家庭照顧服務／諮詢組織培力 等）
 * 自動補上 #sheet 錨點，讓點擊後直接捲到聯絡表單區（id="sheet"）。
 *
 * 為何在 component 層做：round6 把 url 改成 /contact#sheet 只進了本機 seed，
 * 沒有同步到 staging 的 CMS DB；在渲染層正規化就不依賴 DB 內容，staging 直接生效。
 *
 * 規則（保守，避免誤傷）：
 * - 只處理指向聯絡頁的「站內路徑」：/contact 或 /xx/contact（含結尾斜線）。
 * - 已帶任何 hash（#...）的連結原樣保留（尊重既有設定）。
 * - 帶 query string（?...）的不動，避免破壞參數。
 * - 外部連結、mailto:/tel:、純錨點（#...）一律不動。
 */
export function normalizeCtaHref(
  url?: string | null,
  anchor: string = 'sheet',
): string | null | undefined {
  if (!url) return url
  // 已有 hash 或 query 一律不動
  if (url.includes('#') || url.includes('?')) return url
  // 只處理站內絕對路徑
  if (!url.startsWith('/')) return url

  // 去掉結尾斜線後比對是否為聯絡頁：/contact 或 /<locale>/contact
  const path = url.replace(/\/+$/, '')
  const isContact = /^\/(?:[a-z-]+\/)?contact$/i.test(path)
  if (!isContact) return url

  return `${url}#${anchor}`
}
