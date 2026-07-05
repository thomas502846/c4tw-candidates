/**
 * EN 媒體沿用中文版（render 階段回填）。
 *
 * Pages 的 `layout` 區塊陣列整個是 localized:true —— zh-TW 與 EN 各存一份完全獨立的副本，
 * 連照片／影片／裁切位置都各一份。文字本來就該分語言，但媒體大多兩邊相同，
 * 客戶卻得在 EN 重做一次。此函式在 render 階段把 EN 區塊中「留空的媒體欄位」
 * 用 zh-TW 同一區塊的值回填，達成：
 *   留空＝沿用中文版；EN 想不同就自己設一次＝覆寫。
 *
 * 只回填媒體型欄位（上傳照片 / 影片網址 / framePos 裁切位置＋縮放），文字一律不碰。
 * 區塊配對：先以 id，對不到再退回同 index，並用 blockType 把關避免錯位。
 * 巢狀逐項陣列（Hero images[]、TaCta cards[]、Content images[] 等）以同樣規則遞迴。
 */

// 全站 type:'upload' 欄位名（src/blocks 全掃）。值留空時用中文版回填。
const UPLOAD_FIELDS = new Set([
  'backgroundImage',
  'heroImage',
  'icon',
  'image',
  'leadImage',
  'logo',
  'media',
  'photo',
  'poster',
  'spaceImage',
])

// framePos / *FramePos：拖曳焦點＋縮放（json）。
const isFramePosKey = (k: string): boolean => /framepos/i.test(k)
// videoUrl 等影片來源（字串）。
const isVideoKey = (k: string): boolean => /^video/i.test(k)

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

// 媒體欄位「視為留空」：null / undefined / 空字串 / 空物件。
const isEmptyMedia = (v: unknown): boolean =>
  v == null || v === '' || (isPlainObject(v) && Object.keys(v).length === 0)

function mergeNode(en: unknown, zh: unknown): void {
  // 陣列：逐項配對（id 優先、否則同 index），blockType 不同則跳過。
  if (Array.isArray(en) && Array.isArray(zh)) {
    en.forEach((enItem, i) => {
      let zhItem: unknown
      if (isPlainObject(enItem) && enItem.id != null) {
        zhItem = zh.find((z) => isPlainObject(z) && z.id === enItem.id)
      }
      if (zhItem === undefined) zhItem = zh[i]
      if (zhItem === undefined) return
      if (isPlainObject(enItem) && isPlainObject(zhItem)) {
        if (enItem.blockType && zhItem.blockType && enItem.blockType !== zhItem.blockType) return
        mergeNode(enItem, zhItem)
      }
    })
    return
  }

  if (!isPlainObject(en) || !isPlainObject(zh)) return

  for (const key of Object.keys(en)) {
    const enVal = en[key]
    const zhVal = zh[key]
    if (zhVal === undefined) continue

    const isMedia =
      UPLOAD_FIELDS.has(key) || isFramePosKey(key) || (isVideoKey(key) && typeof zhVal === 'string')

    if (isMedia) {
      // 媒體欄位：EN 留空才回填中文版；EN 已自設＝覆寫，保留不動。
      if (isEmptyMedia(enVal) && !isEmptyMedia(zhVal)) en[key] = zhVal
      continue
    }

    // 非媒體：只遞迴進巢狀陣列／群組去找裡面的媒體；文字一律不動。
    if (Array.isArray(enVal) && Array.isArray(zhVal)) mergeNode(enVal, zhVal)
    else if (isPlainObject(enVal) && isPlainObject(zhVal)) mergeNode(enVal, zhVal)
  }
}

/**
 * 把 zh-TW 文件的媒體回填進 EN 文件的 layout（原地修改並回傳 enDoc）。
 * zhDoc 缺漏時原樣回傳，不影響既有行為。
 */
export function inheritLocalizedMedia<T extends { layout?: unknown }>(
  enDoc: T,
  zhDoc: { layout?: unknown } | null | undefined,
): T {
  if (enDoc && zhDoc && Array.isArray(enDoc.layout) && Array.isArray(zhDoc.layout)) {
    mergeNode(enDoc.layout, zhDoc.layout)
  }
  return enDoc
}
