/**
 * framePositionCss — 每裝置（手機／平板／電腦）的「照片在框內位置＋縮放」資料模型與 CSS 產生器。
 *
 * 編輯端（CMS 自訂欄位）以拖曳焦點＋縮放滑桿產生這份資料；前端把它轉成 scoped <style>，
 * 在 md(768)／lg(1024) 兩個斷點分別套用 object-position 與 transform: scale。
 *
 * 為何用 inline <style> 而非 Tailwind class：值是 CMS 動態資料，Tailwind 無法在執行期產生任意值的 class。
 * transform-origin 跟著焦點走，縮放才會以焦點為中心收放、不會把主體推出框外。
 */

export type FrameTier = {
  /** 水平焦點 0–100（%） */
  x: number
  /** 垂直焦點 0–100（%） */
  y: number
  /** 縮放倍率，1 = 滿框不放大 */
  zoom: number
}

export type FramePosition = {
  mobile: FrameTier
  tablet: FrameTier
  desktop: FrameTier
}

export const DEFAULT_TIER: FrameTier = { x: 50, y: 50, zoom: 1 }

export const DEFAULT_FRAME_POSITION: FramePosition = {
  mobile: { ...DEFAULT_TIER },
  tablet: { ...DEFAULT_TIER },
  desktop: { ...DEFAULT_TIER },
}

const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))

// 縮放下限 0.5：低於 1 切到 object-fit:contain（完整顯示、留白），1 以上為 cover（填滿→放大）。
export const ZOOM_MIN = 0.5
export const ZOOM_MAX = 3

const normaliseTier = (t: Partial<FrameTier> | undefined, fallback: FrameTier): FrameTier => ({
  x: clamp(t?.x ?? fallback.x, 0, 100),
  y: clamp(t?.y ?? fallback.y, 0, 100),
  zoom: clamp(t?.zoom ?? fallback.zoom, ZOOM_MIN, ZOOM_MAX),
})

/** 舊 PageHeader 的 top/center/bottom 下拉 → 對應焦點，作為未設定每裝置位置時的回退。 */
export const focalToTier = (focal?: string | null): FrameTier => {
  const y = focal === 'top' ? 0 : focal === 'bottom' ? 100 : 50
  return { x: 50, y, zoom: 1 }
}

/**
 * 把可能殘缺／未知型別的 CMS 值整理成完整 FramePosition。
 * defaults 讓各區塊能帶入自己的預設焦點（例如直式人物 hero 預設 y:30）。
 */
export const resolveFramePosition = (
  value: unknown,
  defaults: FramePosition = DEFAULT_FRAME_POSITION,
): FramePosition => {
  const v = (value && typeof value === 'object' ? value : {}) as Partial<FramePosition>
  return {
    mobile: normaliseTier(v.mobile, defaults.mobile),
    tablet: normaliseTier(v.tablet, defaults.tablet),
    desktop: normaliseTier(v.desktop, defaults.desktop),
  }
}

// zoom < 1 → contain（顯示完整照片、比例不合處留白透明）；>= 1 → cover（填滿後再放大）。
// transform-origin 跟焦點走：放大時以焦點為中心收放、留白時把照片靠向焦點側。
const tierRule = (t: FrameTier): string => {
  const fit = t.zoom < 1 ? 'contain' : 'cover'
  return `object-fit:${fit};object-position:${t.x}% ${t.y}%;transform:scale(${t.zoom});transform-origin:${t.x}% ${t.y}%;`
}

/**
 * 產生 scoped CSS：手機（base）／平板（min-width:768）／電腦（min-width:1024）。
 * selector 例：`#fp-abc img`
 */
export const buildFramePositionCss = (selector: string, pos: FramePosition): string =>
  [
    `${selector}{${tierRule(pos.mobile)}}`,
    `@media(min-width:768px){${selector}{${tierRule(pos.tablet)}}}`,
    `@media(min-width:1024px){${selector}{${tierRule(pos.desktop)}}}`,
  ].join('')
